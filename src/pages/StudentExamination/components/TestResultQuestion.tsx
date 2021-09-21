import React from 'react';
import { ExamResultQuestion } from 'resources/student/ExamResultQuestion';
import { Col, Row } from 'react-bootstrap';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { ExamQuestionCard } from 'components/ExamQuestionCard';
import { IsCorrect } from 'components/IsCorrect';

type Props = {
    question: ExamResultQuestion
}

export function TestResultQuestion({ question }: Props) {
    return (
        <ExamQuestionCard text={question.questionText}>
            <Row>
                <Col sm={10}>
                    <MarkdownRenderer source={question.answerText} />
                </Col>
                <Col sm={2} className="d-flex justify-content-end">
                    <IsCorrect value={question.isCorrect} showText />
                </Col>
            </Row>
        </ExamQuestionCard>
    );
}
