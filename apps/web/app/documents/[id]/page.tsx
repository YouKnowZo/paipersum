"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { EnhancedAnalysisT } from "@/lib/schemas";

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetch(`/api/documents/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDocument(data.document);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, status]);

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  const analysis = document.analysis as EnhancedAnalysisT;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-brand-blue">
            PaiperSum
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost">← Back</Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">{document.name}</h1>

        {analysis && (
          <div className="space-y-6">
            {/* Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  {analysis.risk_score}/100
                </div>
                <div className="text-sm text-gray-600">
                  Confidence: {(analysis.confidence * 100).toFixed(0)}%
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      analysis.recommendation.decision === "sign"
                        ? "bg-green-100 text-green-700"
                        : analysis.recommendation.decision === "negotiate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {analysis.recommendation.decision.toUpperCase()}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  {analysis.recommendation.reasoning}
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Action Items:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.recommendation.action_items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Clauses */}
            <Card>
              <CardHeader>
                <CardTitle>Detected Clauses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.clauses.map((clause, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border-2 ${
                        clause.risk === "red"
                          ? "border-red-200 bg-red-50"
                          : clause.risk === "yellow"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold">{clause.title}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            clause.risk === "red"
                              ? "bg-red-200 text-red-800"
                              : clause.risk === "yellow"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {clause.risk.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {clause.summary}
                      </p>
                      {clause.citation && (
                        <p className="text-xs text-gray-500 italic">
                          "{clause.citation.substring(0, 200)}..."
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Legal Disclaimer:</strong> This analysis is for informational
            purposes only and does not constitute legal advice. Always consult a
            licensed attorney for legal decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
