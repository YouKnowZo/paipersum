from transformers import pipeline
from typing import List, Dict

_LABELS = [
    'Indemnification','Release/Waiver','Arbitration','Class Action Waiver',
    'Auto-Renewal','No Warranty','Governing Law/Venue','Data Sharing','Assumption of Risk'
]

_classifier = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')

def classify_clauses(text: str) -> List[Dict]:
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    results = []
    for ch in chunks:
        out = _classifier(ch, candidate_labels=_LABELS, multi_label=True)
        for lbl, score in zip(out['labels'], out['scores']):
            if score > 0.6:
                results.append({"title": lbl, "score": float(score), "snippet": ch[:200]})
    return results
