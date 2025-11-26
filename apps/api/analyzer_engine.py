"""
Universal AI Analyzer Engine - Handles any content type
Supports: documents, articles, code, contracts, emails, research papers, etc.
"""

import re
from typing import List, Dict, Optional, Literal
from dataclasses import dataclass
import os

# Try to use free AI APIs if available
try:
    import openai
    OPENAI_AVAILABLE = bool(os.getenv('OPENAI_API_KEY'))
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = bool(os.getenv('ANTHROPIC_API_KEY'))
except ImportError:
    ANTHROPIC_AVAILABLE = False


@dataclass
class ContentAnalysis:
    """Universal content analysis result"""
    content_type: str
    summary: str
    key_points: List[str]
    sentiment: Literal['positive', 'neutral', 'negative', 'mixed']
    topics: List[str]
    action_items: List[str]
    confidence: float
    word_count: int
    reading_time_minutes: int
    complexity_score: int  # 0-100, higher = more complex


def detect_content_type(text: str) -> str:
    """Detect what type of content this is"""
    text_lower = text.lower()
    
    # Code detection
    if any(pattern in text for pattern in ['def ', 'function ', 'class ', 'import ', 'const ', 'var ', '<?php', '<html']):
        return 'code'
    
    # Legal/contract detection
    if any(word in text_lower for word in ['agreement', 'contract', 'terms of service', 'indemnif', 'waiver', 'lease']):
        return 'legal_document'
    
    # Email detection
    if re.search(r'^(from|to|subject|date):', text, re.MULTILINE | re.IGNORECASE):
        return 'email'
    
    # Research paper detection
    if any(word in text_lower for word in ['abstract', 'introduction', 'methodology', 'conclusion', 'references']):
        return 'research_paper'
    
    # Article/blog detection
    if any(word in text_lower for word in ['article', 'blog', 'post', 'published']):
        return 'article'
    
    # Technical documentation
    if any(word in text_lower for word in ['api', 'endpoint', 'documentation', 'tutorial', 'guide']):
        return 'technical_doc'
    
    return 'general_text'


def analyze_with_ai(text: str, content_type: str) -> Optional[Dict]:
    """Use AI APIs for advanced analysis if available"""
    
    # Try OpenAI first (free tier available)
    if OPENAI_AVAILABLE:
        try:
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # Free tier compatible
                messages=[
                    {"role": "system", "content": f"You are an expert {content_type} analyzer. Provide concise, actionable insights."},
                    {"role": "user", "content": f"Analyze this {content_type}:\n\n{text[:4000]}"}
                ],
                max_tokens=500,
                temperature=0.3
            )
            return {"summary": response.choices[0].message.content}
        except Exception as e:
            print(f"OpenAI API error: {e}")
    
    # Try Anthropic Claude (free tier available)
    if ANTHROPIC_AVAILABLE:
        try:
            client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
            message = client.messages.create(
                model="claude-3-haiku-20240307",  # Fastest/cheapest model
                max_tokens=500,
                messages=[{
                    "role": "user",
                    "content": f"Analyze this {content_type} concisely:\n\n{text[:4000]}"
                }]
            )
            return {"summary": message.content[0].text}
        except Exception as e:
            print(f"Anthropic API error: {e}")
    
    return None


def extract_key_points(text: str, content_type: str) -> List[str]:
    """Extract key points from content"""
    points = []
    
    # Extract bullet points or numbered lists
    bullet_pattern = r'^[\s]*[-•*]\s+(.+)$'
    numbered_pattern = r'^\d+[\.\)]\s+(.+)$'
    
    for line in text.split('\n'):
        for pattern in [bullet_pattern, numbered_pattern]:
            match = re.match(pattern, line)
            if match:
                point = match.group(1).strip()
                if len(point) > 10 and len(point) < 200:
                    points.append(point)
                    if len(points) >= 10:
                        return points
    
    # Extract sentences with important keywords
    sentences = re.split(r'[.!?]+', text)
    important_keywords = ['important', 'critical', 'note', 'warning', 'must', 'should', 'key', 'main']
    
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in important_keywords):
            cleaned = sentence.strip()
            if 20 < len(cleaned) < 200:
                points.append(cleaned)
                if len(points) >= 10:
                    break
    
    return points[:10]


def analyze_sentiment(text: str) -> Literal['positive', 'neutral', 'negative', 'mixed']:
    """Simple sentiment analysis"""
    text_lower = text.lower()
    
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'happy', 'success']
    negative_words = ['bad', 'terrible', 'awful', 'worst', 'hate', 'fail', 'error', 'problem', 'issue', 'risk']
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count * 1.5:
        return 'positive'
    elif neg_count > pos_count * 1.5:
        return 'negative'
    elif pos_count > 0 and neg_count > 0:
        return 'mixed'
    else:
        return 'neutral'


def extract_topics(text: str) -> List[str]:
    """Extract main topics/themes"""
    # Simple keyword extraction (can be enhanced with NLP)
    common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'}
    
    words = re.findall(r'\b[a-z]{4,}\b', text.lower())
    word_freq = {}
    
    for word in words:
        if word not in common_words:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Get top 5 most frequent words as topics
    topics = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
    return [topic[0].title() for topic in topics]


def calculate_complexity(text: str) -> int:
    """Calculate content complexity score (0-100)"""
    # Factors: sentence length, word length, punctuation density
    sentences = re.split(r'[.!?]+', text)
    words = text.split()
    
    if not sentences or not words:
        return 50
    
    avg_sentence_length = len(words) / max(len(sentences), 1)
    avg_word_length = sum(len(w) for w in words) / len(words)
    
    # Normalize to 0-100
    complexity = min(100, int((avg_sentence_length / 20) * 30 + (avg_word_length / 5) * 30))
    return complexity


def analyze_content(text: str, use_ai: bool = True) -> ContentAnalysis:
    """Main analysis function - handles any content type"""
    
    if not text or not text.strip():
        raise ValueError("Text cannot be empty")
    
    content_type = detect_content_type(text)
    word_count = len(text.split())
    reading_time = max(1, word_count // 200)  # ~200 words per minute
    
    # Try AI analysis first
    ai_result = None
    if use_ai:
        ai_result = analyze_with_ai(text, content_type)
    
    # Generate summary
    if ai_result and 'summary' in ai_result:
        summary = ai_result['summary']
    else:
        # Fallback: extract first few sentences
        sentences = re.split(r'[.!?]+', text)
        summary = '. '.join(sentences[:3]).strip() + '.'
        if len(summary) > 300:
            summary = summary[:297] + '...'
    
    # Extract key points
    key_points = extract_key_points(text, content_type)
    if not key_points:
        # Fallback: use first few sentences
        sentences = re.split(r'[.!?]+', text)
        key_points = [s.strip() for s in sentences[:5] if len(s.strip()) > 20][:5]
    
    # Analyze sentiment
    sentiment = analyze_sentiment(text)
    
    # Extract topics
    topics = extract_topics(text)
    
    # Generate action items based on content type
    action_items = generate_action_items(text, content_type)
    
    # Calculate complexity
    complexity = calculate_complexity(text)
    
    # Calculate confidence (higher if we have AI analysis)
    confidence = 0.85 if ai_result else 0.65
    
    return ContentAnalysis(
        content_type=content_type,
        summary=summary,
        key_points=key_points,
        sentiment=sentiment,
        topics=topics,
        action_items=action_items,
        confidence=confidence,
        word_count=word_count,
        reading_time_minutes=reading_time,
        complexity_score=complexity
    )


def generate_action_items(text: str, content_type: str) -> List[str]:
    """Generate actionable items based on content type"""
    items = []
    
    if content_type == 'legal_document':
        items.extend([
            "Review all highlighted clauses carefully",
            "Consult with a legal professional before signing",
            "Keep a copy of this document for your records"
        ])
    elif content_type == 'code':
        items.extend([
            "Review code for security vulnerabilities",
            "Check for proper error handling",
            "Ensure code follows best practices"
        ])
    elif content_type == 'email':
        items.extend([
            "Respond within 24-48 hours",
            "Archive important information",
            "Follow up if action is required"
        ])
    elif content_type == 'research_paper':
        items.extend([
            "Review methodology section",
            "Check references and citations",
            "Consider practical applications"
        ])
    else:
        items.extend([
            "Review key points highlighted above",
            "Take notes on important information",
            "Share with relevant stakeholders if needed"
        ])
    
    return items[:5]
