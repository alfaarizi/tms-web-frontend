import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import { ExamQuestionSet } from 'resources/instructor/ExamQuestionSet';
import {
    useCreateQuestionMutation,
    useQuestionsForSet,
    useRemoveQuestionMutation,
    useUpdateQuestionMutation,
} from 'hooks/instructor/ExamQuestionHooks';
import { ExamQuestion } from 'resources/instructor/ExamQuestion';
import { useShow } from 'ui-hooks/useShow';
import { QuestionList } from 'pages/InstructorExamination/components/QuestionList/QuestionsList';
import { QuestionFormModal } from 'pages/InstructorExamination/components/QuestionSets/QuestionFormModal';
import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';
import {
    useCreateAnswerMutation,
    useRemoveAnswerMutation,
    useUpdateAnswerMutation,
} from 'hooks/instructor/ExamAnswerHooks';
import { AnswerFormModal } from 'pages/InstructorExamination/components/QuestionSets/AnswerFormModal';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { InsertFunc } from 'components/ReactMdeWithCommands';
import { ExamImageGallery } from 'pages/InstructorExamination/containers/QuestionSets/ExamImageGallery';

type Props = {
    questionSet: ExamQuestionSet
};

export function QuestionsEditor({ questionSet }: Props) {
    const { t } = useTranslation();
    const questions = useQuestionsForSet(questionSet.id);
    const createQuestionMutation = useCreateQuestionMutation();
    const removeQuestionMutation = useRemoveQuestionMutation();
    const updateQuestionMutation = useUpdateQuestionMutation();
    const showNew = useShow();
    const [editedQuestion, setEditedQuestion] = useState<ExamQuestion | null>(null);

    const createAnswerMutation = useCreateAnswerMutation();
    const removeAnswerMutation = useRemoveAnswerMutation();
    const updateAnswerMutation = useUpdateAnswerMutation();

    const [questionToAddAnswer, setQuestionToAddAnswer] = useState(-1);
    const [editedAnswer, setEditedAnswer] = useState<ExamAnswer | null>(null);
    const [textError, setTextError] = useState<string | undefined>();

    if (!questions.data) {
        return null;
    }

    const handleNewQuestionSave = async (data: ExamQuestion) => {
        try {
            await createQuestionMutation.mutateAsync({
                ...data,
                questionsetID: questionSet.id,
            });
            showNew.toHide();
        } catch (e) {
            // Already handled globally
        }
    };

    const handleRemoveQuestion = (question: ExamQuestion) => {
        removeQuestionMutation.mutate(question);
    };

    const handleUpdateQuestion = async (data: ExamQuestion) => {
        try {
            if (editedQuestion) {
                await updateQuestionMutation.mutateAsync({
                    ...editedQuestion,
                    text: data.text,
                });
                setEditedQuestion(null);
            }
        } catch (e) {
            // Already handled globally
        }
    };

    const handleCreateAnswer = async (data: ExamAnswer) => {
        try {
            setTextError(undefined);
            await createAnswerMutation.mutateAsync({
                ...data,
                questionID: questionToAddAnswer,
            });
            setQuestionToAddAnswer(-1);
        } catch (e) {
            if (e instanceof ServerSideValidationError && e.body.text) {
                setTextError(e.body.text[0]);
            }
        }
    };

    const handleRemoveAnswer = (answer: ExamAnswer) => {
        removeAnswerMutation.mutate(answer);
    };

    const handleUpdateAnswer = async (data: ExamAnswer) => {
        if (!editedAnswer) {
            return;
        }
        try {
            setTextError(undefined);
            await updateAnswerMutation.mutateAsync({
                ...data,
                id: editedAnswer.id,
                questionID: editedAnswer.questionID,
            });
            setEditedAnswer(null);
        } catch (e) {
            if (e instanceof ServerSideValidationError && e.body.text) {
                setTextError(e.body.text[0]);
            }
        }
    };

    const renderGallery = (insertFunc: InsertFunc) => (
        <ExamImageGallery
            questionSetID={questionSet.id}
            insertFunc={insertFunc}
        />
    );

    return (
        <>
            <ToolbarButton
                icon={faPlus}
                onClick={showNew.toShow}
                text={t('examQuestions.newQuestion')}
            />
            <QuestionList
                questions={questions.data}
                renderQuestionOptions={(question) => (
                    <>
                        <ToolbarButton
                            icon={faEdit}
                            onClick={() => setEditedQuestion(question)}
                            text={t('common.edit')}
                        />
                        <DeleteButton showText onDelete={() => handleRemoveQuestion(question)} />
                        <ToolbarButton
                            icon={faPlus}
                            onClick={() => setQuestionToAddAnswer(question.id)}
                            text={t('examQuestions.newAnswer')}
                        />
                    </>
                )}
                renderAnswerOptions={(answer) => (
                    <>
                        <ToolbarButton icon={faEdit} onClick={() => setEditedAnswer(answer)} />
                        <DeleteButton showText={false} onDelete={() => handleRemoveAnswer(answer)} />
                    </>
                )}
            />

            <QuestionFormModal
                title={t('examQuestions.createQuestion')}
                show={showNew.show}
                renderGallery={renderGallery}
                onSave={handleNewQuestionSave}
                onCancel={showNew.toHide}
            />

            <QuestionFormModal
                title={t('examQuestions.editQuestion')}
                show={!!editedQuestion}
                editData={editedQuestion}
                renderGallery={renderGallery}
                onSave={handleUpdateQuestion}
                onCancel={() => setEditedQuestion(null)}
            />

            <AnswerFormModal
                title={t('examQuestions.newAnswer')}
                show={questionToAddAnswer > -1}
                onSave={handleCreateAnswer}
                textError={textError}
                renderGallery={renderGallery}
                onCancel={() => setQuestionToAddAnswer(-1)}
            />

            <AnswerFormModal
                title={t('examQuestions.editAnswer')}
                editData={editedAnswer}
                show={!!editedAnswer}
                onSave={handleUpdateAnswer}
                textError={textError}
                renderGallery={renderGallery}
                onCancel={() => setEditedAnswer(null)}
            />
        </>
    );
}
