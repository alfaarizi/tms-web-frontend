import { ButtonGroup, Col, Row } from 'react-bootstrap';
import React, { ReactNode } from 'react';

import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { IsCorrect } from 'components/IsCorrect';

type Props = {
    answer: ExamAnswer,
    renderAnswerOptions?: (answer: ExamAnswer) => ReactNode
}

export function AnswerListItem({
    answer,
    renderAnswerOptions,
}: Props) {
    return (
        <ListCardItem>
            <Row>
                <Col xs={1}>
                    <IsCorrect value={!!answer.correct} showText={false} />
                    {' '}
                </Col>
                <Col xs={8} md={9}><MarkdownRenderer source={answer.text} /></Col>

                <Col xs={3} md={2}>
                    <ButtonGroup className="float-right">
                        {renderAnswerOptions ? renderAnswerOptions(answer) : null}
                    </ButtonGroup>
                    <div className="clearfix" />
                </Col>
            </Row>
        </ListCardItem>
    );
}
