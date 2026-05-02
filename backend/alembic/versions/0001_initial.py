"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-05-02
"""
from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("department", sa.String(length=120), nullable=False),
        sa.Column("years_required", sa.Float(), nullable=False),
        sa.Column("location", sa.String(length=120), nullable=False),
        sa.Column("work_mode", sa.String(length=80), nullable=False),
        sa.Column("salary_band", sa.String(length=120), nullable=False),
        sa.Column("jd_text", sa.Text(), nullable=False),
        sa.Column("parsed", sa.JSON(), nullable=False),
        sa.Column("skill_graph", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "candidates",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("resume_text", sa.Text(), nullable=False),
        sa.Column("portfolio_url", sa.String(length=500), nullable=False),
        sa.Column("github_url", sa.String(length=500), nullable=False),
        sa.Column("linkedin_url", sa.String(length=500), nullable=False),
        sa.Column("cover_letter", sa.Text(), nullable=False),
        sa.Column("parsed", sa.JSON(), nullable=False),
        sa.Column("normalized", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"]),
    )
    op.create_table(
        "match_results",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("candidate_id", sa.Integer(), nullable=False),
        sa.Column("final_score", sa.Float(), nullable=False),
        sa.Column("decision", sa.String(length=40), nullable=False),
        sa.Column("confidence_score", sa.Float(), nullable=False),
        sa.Column("confidence_label", sa.String(length=20), nullable=False),
        sa.Column("score_breakdown", sa.JSON(), nullable=False),
        sa.Column("explainability", sa.JSON(), nullable=False),
        sa.Column("hallucination_flags", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"]),
        sa.ForeignKeyConstraint(["candidate_id"], ["candidates.id"]),
    )


def downgrade() -> None:
    op.drop_table("match_results")
    op.drop_table("candidates")
    op.drop_table("jobs")
