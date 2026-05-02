from app.services.scoring import compute_weighted_score


def test_weighted_score_shortlist():
    score, decision = compute_weighted_score(
        {
            "skill_match": 95,
            "experience_match": 85,
            "project_relevance": 90,
            "industry_match": 80,
            "education_cert": 90,
            "leadership_soft_skills": 88,
        }
    )
    assert score >= 85
    assert decision == "SHORTLIST"


def test_weighted_score_reject():
    score, decision = compute_weighted_score(
        {
            "skill_match": 20,
            "experience_match": 10,
            "project_relevance": 25,
            "industry_match": 30,
            "education_cert": 20,
            "leadership_soft_skills": 15,
        }
    )
    assert score < 65
    assert decision == "REJECT"
