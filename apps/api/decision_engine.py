"""
Decision Engine - Provides clear recommendations and actionable insights
This is what makes PaiperSum actually USEFUL instead of just informative
"""

from typing import List, Dict, Tuple, Literal
from dataclasses import dataclass

@dataclass
class Recommendation:
    decision: Literal['sign', 'negotiate', 'walk_away']
    confidence: float
    reasoning: str
    action_items: List[str]
    cost_impact: int  # Dollars saved/at risk
    
@dataclass
class Benchmark:
    your_value: str
    average_value: str
    percentile: int  # What % of contracts are worse
    is_good: bool

@dataclass
class NegotiationPoint:
    clause_title: str
    current_term: str
    suggested_term: str
    success_rate: float
    email_template: str
    importance: Literal['critical', 'important', 'nice_to_have']

# Benchmarking data (in production, this comes from database)
BENCHMARKS = {
    'gym_membership': {
        'cancellation_fee': {'avg': 50, 'max_good': 100},
        'commitment_months': {'avg': 12, 'max_good': 12},
        'auto_renewal': {'avg_has': 0.9},  # 90% have auto-renewal
    },
    'apartment_lease': {
        'security_deposit_months': {'avg': 1.5, 'max_good': 2},
        'pet_deposit': {'avg': 250, 'max_good': 300},
        'late_fee': {'avg': 50, 'max_good': 75},
        'lease_break_penalty_months': {'avg': 2, 'max_good': 2},
    },
    'phone_contract': {
        'contract_months': {'avg': 24, 'max_good': 24},
        'early_termination_fee': {'avg': 200, 'max_good': 300},
        'data_sharing': {'avg_has': 0.7},
    },
    'software_tos': {
        'data_retention_days': {'avg': 90, 'max_good': 180},
        'liability_cap': {'avg': 1000, 'max_good': 100},
        'arbitration': {'avg_has': 0.6},
    }
}

def extract_key_terms(text: str, doc_type: str = 'general') -> Dict[str, any]:
    """Extract specific terms from document"""
    import re
    
    terms = {}
    
    # Cancellation fee
    match = re.search(r'\$?(\d+)\s*(?:dollar|cancellation|termination)\s*fee', text, re.I)
    if match:
        terms['cancellation_fee'] = int(match.group(1))
    
    # Commitment period
    match = re.search(r'(\d+)[\s-]*(year|month|yr|mo)[\s-]*(?:term|contract|commitment|agreement)', text, re.I)
    if match:
        months = int(match.group(1))
        if 'year' in match.group(2).lower() or 'yr' in match.group(2).lower():
            months *= 12
        terms['commitment_months'] = months
    
    # Security deposit
    match = re.search(r'security\s*deposit.*?\$?(\d+)', text, re.I)
    if match:
        terms['security_deposit'] = int(match.group(1))
    
    # Pet deposit
    match = re.search(r'pet.*?(?:deposit|fee).*?\$?(\d+)', text, re.I)
    if match:
        terms['pet_deposit'] = int(match.group(1))
    
    return terms

def calculate_benchmarks(terms: Dict, doc_type: str) -> List[Benchmark]:
    """Compare document terms to benchmarks"""
    benchmarks = []
    
    if doc_type not in BENCHMARKS:
        return benchmarks
    
    bench_data = BENCHMARKS[doc_type]
    
    for key, value in terms.items():
        if key not in bench_data:
            continue
            
        bench = bench_data[key]
        
        if 'avg' in bench:
            avg = bench['avg']
            max_good = bench.get('max_good', avg * 1.5)
            
            if isinstance(value, (int, float)):
                percentile = min(100, int((value - avg) / (max_good - avg) * 50 + 50))
                is_good = value <= max_good
                
                benchmarks.append(Benchmark(
                    your_value=f"${value}" if 'fee' in key or 'deposit' in key else str(value),
                    average_value=f"${avg}" if 'fee' in key or 'deposit' in key else str(avg),
                    percentile=percentile,
                    is_good=is_good
                ))
    
    return benchmarks

def generate_recommendation(
    risk_score: int,
    clauses: List[Dict],
    terms: Dict,
    doc_type: str
) -> Recommendation:
    """Generate clear recommendation: sign, negotiate, or walk away"""
    
    # Count severe issues
    red_flags = [c for c in clauses if c['risk'] == 'red']
    yellow_flags = [c for c in clauses if c['risk'] == 'yellow']
    
    # Check for deal-breakers
    deal_breakers = []
    for clause in red_flags:
        if any(term in clause['title'].lower() for term in ['indemnif', 'waive', 'release', 'assumption of risk']):
            deal_breakers.append(clause['title'])
    
    # Determine decision
    if len(deal_breakers) >= 2 or risk_score >= 85:
        decision = 'walk_away'
        reasoning = f"This contract has {len(deal_breakers)} deal-breaker clauses that put you at serious financial/legal risk."
        confidence = 0.9
        
    elif risk_score >= 60 or len(red_flags) >= 1 or len(yellow_flags) >= 3:
        decision = 'negotiate'
        reasoning = f"This contract has {len(red_flags)} high-risk and {len(yellow_flags)} moderate-risk clauses that should be improved before signing."
        confidence = 0.8
        
    else:
        decision = 'sign'
        reasoning = "This appears to be a standard contract with typical terms for this type of agreement."
        confidence = 0.7
    
    # Generate action items
    action_items = []
    cost_impact = 0
    
    if decision == 'walk_away':
        action_items = [
            f"DO NOT SIGN - {deal_breakers[0]} clause is a serious red flag",
            "Look for alternative providers without these terms",
            "If you must use this provider, consult a lawyer first"
        ]
        cost_impact = 2000  # Potential savings from avoiding bad contract
        
    elif decision == 'negotiate':
        if red_flags:
            action_items.append(f"Remove or modify: {red_flags[0]['title']}")
            cost_impact += 500
        if len(yellow_flags) >= 2:
            action_items.append(f"Negotiate better terms for: {yellow_flags[0]['title']}")
            cost_impact += 200
        if 'cancellation_fee' in terms and terms['cancellation_fee'] > 100:
            action_items.append(f"Reduce cancellation fee from ${terms['cancellation_fee']} to $50-75")
            cost_impact += terms['cancellation_fee'] - 75
        if len(action_items) == 0:
            action_items.append("Request clarification on ambiguous clauses")
            
    else:  # sign
        action_items = [
            "Review one more time to ensure you understand all terms",
            "Keep a copy for your records",
            "Set calendar reminders for key dates (renewal, cancellation deadlines)"
        ]
        cost_impact = 0
    
    return Recommendation(
        decision=decision,
        confidence=confidence,
        reasoning=reasoning,
        action_items=action_items,
        cost_impact=cost_impact
    )

def generate_negotiation_templates(
    clauses: List[Dict],
    terms: Dict,
    doc_type: str
) -> List[NegotiationPoint]:
    """Generate specific negotiation points with email templates"""
    
    points = []
    
    # High cancellation fee
    if 'cancellation_fee' in terms and terms['cancellation_fee'] > 100:
        points.append(NegotiationPoint(
            clause_title="Cancellation Fee",
            current_term=f"${terms['cancellation_fee']} cancellation fee",
            suggested_term="$50-75 cancellation fee",
            success_rate=0.68,
            email_template=f"""Subject: Request to Modify Cancellation Terms

Hi [Company Name],

I'm interested in signing up, but I have a concern about the ${terms['cancellation_fee']} cancellation fee in Section [X].

Industry standard for {doc_type.replace('_', ' ')} is $50-75. Would you consider matching that standard?

I'm ready to sign today if we can agree on this point.

Thank you,
[Your Name]""",
            importance='important'
        ))
    
    # Arbitration clause
    has_arbitration = any('arbitration' in c['title'].lower() for c in clauses)
    if has_arbitration:
        points.append(NegotiationPoint(
            clause_title="Arbitration Clause",
            current_term="Mandatory binding arbitration",
            suggested_term="Small claims court exception",
            success_rate=0.35,
            email_template="""Subject: Request for Small Claims Court Exception

Hi [Company Name],

I've reviewed the arbitration clause and would like to request adding a small claims court exception.

This is becoming standard in the industry and would make me more comfortable proceeding.

Can we add: "Either party may bring a claim in small claims court"?

Thank you,
[Your Name]""",
            importance='nice_to_have'
        ))
    
    # High pet deposit (for leases)
    if 'pet_deposit' in terms and terms['pet_deposit'] > 300:
        points.append(NegotiationPoint(
            clause_title="Pet Deposit",
            current_term=f"${terms['pet_deposit']} pet deposit",
            suggested_term="$250 pet deposit (market average)",
            success_rate=0.52,
            email_template=f"""Subject: Pet Deposit Negotiation

Hi [Landlord Name],

I'm very interested in the property and ready to sign. I have one question about the ${terms['pet_deposit']} pet deposit.

The average pet deposit in this area is $250. Would you consider matching that?

My pet is well-trained with references from previous landlords.

Thank you,
[Your Name]""",
            importance='important'
        ))
    
    return points

def calculate_cost_scenarios(terms: Dict, doc_type: str) -> List[Dict]:
    """Calculate different cost scenarios"""
    
    scenarios = []
    
    if doc_type == 'gym_membership' and 'cancellation_fee' in terms:
        monthly = 50  # Assume $50/mo average
        commitment = terms.get('commitment_months', 12)
        cancel_fee = terms['cancellation_fee']
        
        scenarios.append({
            'name': 'Complete Full Term',
            'cost': monthly * commitment,
            'description': f'Pay ${monthly}/mo for {commitment} months',
            'is_best': True
        })
        
        scenarios.append({
            'name': 'Cancel After 6 Months',
            'cost': monthly * 6 + cancel_fee,
            'description': f'Use 6 months + ${cancel_fee} cancellation fee',
            'is_best': False
        })
        
        scenarios.append({
            'name': 'Forget to Cancel (Auto-Renews)',
            'cost': monthly * commitment * 2 + cancel_fee,
            'description': f'Auto-renews for another year + cancellation',
            'is_best': False,
            'warning': 'Common trap! Set reminders!'
        })
    
    return scenarios
