"""Configuration values for the ingest → summarize pipeline."""

from pydantic import Field
from pydantic_settings import BaseSettings


class PipelineSettings(BaseSettings):
    embed_model_name: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        description="SentenceTransformer model used for embeddings.",
    )
    summarizer_model_name: str = Field(
        default="facebook/bart-large-cnn",
        description="Transformers summarization model name.",
    )
    chunk_max_chars: int = Field(
        default=2800,
        description="Maximum number of characters per chunk before overlap is applied.",
    )
    chunk_overlap_chars: int = Field(
        default=200,
        description="Character overlap between sequential chunks to preserve continuity.",
    )
    retrieval_k: int = Field(
        default=6,
        description="Number of chunks to retrieve per query before filtering.",
    )
    retrieval_scoring_multiplier: int = Field(
        default=3,
        description="Multiplier for over-fetching chunks before applying filters.",
    )
    max_context_chars: int = Field(
        default=12000,
        description="Maximum total characters from retrieved chunks fed into the summarizer.",
    )
    default_summary_style: str = Field(
        default="concise",
        description="Fallback summary style when none is provided by the client.",
    )

    class Config:
        env_prefix = "PIPELINE_"


settings = PipelineSettings()
