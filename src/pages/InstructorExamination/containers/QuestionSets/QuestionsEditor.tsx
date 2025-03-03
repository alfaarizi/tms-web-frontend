import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import { QuizQuestionSet } from 'resources/instructor/QuizQuestionSet';
import {
    useCreateQuestionMutation,
    useQuestionsForSet,
    useRemoveQuestionMutation,
    useUpdateQuestionMutation,
} from 'hooks/instructor/QuizQuestionHooks';
import { QuizQuestion } from 'resources/instructor/QuizQuestion';
import { useShow } from 'ui-hooks/useShow';
import { QuestionList } from 'pages/InstructorExamination/components/QuestionList/QuestionsList';
import { QuestionFormModal } from 'pages/InstructorExamination/components/QuestionSets/QuestionFormModal';
import { QuizAnswer } from 'resources/instructor/QuizAnswer';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';
import {
    useCreateAnswerMutation,
    useRemoveAnswerMutation,
    useUpdateAnswerMutation,
} from 'hooks/instructor/QuizAnswerHooks';
import { AnswerFormModal } from 'pages/InstructorExamination/components/QuestionSets/AnswerFormModal';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { InsertFunc } from 'components/ReactMdeWithCommands';
import { QuizImageGallery } from 'pages/InstructorExamination/containers/QuestionSets/QuizImageGallery';

type Props = {
    questionSet: QuizQuestionSet
};

export function QuestionsEditor({ questionSet }: Props) {
    const { t } = useTranslation();
    const questions = useQuestionsForSet(questionSet.id);
    const createQuestionMutation = useCreateQuestionMutation();
    const removeQuestionMutation = useRemoveQuestionMutation();
    const updateQuestionMutation = useUpdateQuestionMutation();
    const showNew = useShow();
    const [editedQuestion, setEditedQuestion] = useState<QuizQuestion | null>(null);

    const createAnswerMutation = useCreateAnswerMutation();
    const removeAnswerMutation = useRemoveAnswerMutation();
    const updateAnswerMutation = useUpdateAnswerMutation();

    const [questionToAddAnswer, setQuestionToAddAnswer] = useState(-1);
    const [editedAnswer, setEditedAnswer] = useState<QuizAnswer | null>(null);
    const [textError, setTextError] = useState<string | undefined>();

    if (!questions.data) {
        return null;
    }

    const handleNewQuestionSave = async (data: QuizQuestion) => {
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

    const handleRemoveQuestion = (question: QuizQuestion) => {
        removeQuestionMutation.mutate(question);
    };

    const handleUpdateQuestion = async (data: QuizQuestion) => {
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

    const handleCreateAnswer = async (data: QuizAnswer) => {
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

    const handleRemoveAnswer = (answer: QuizAnswer) => {
        removeAnswerMutation.mutate(answer);
    };

    const handleUpdateAnswer = async (data: QuizAnswer) => {
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
        <QuizImageGallery
            questionSetID={questionSet.id}
            insertFunc={insertFunc}
        />
    );

    return (
        <>
            <ToolbarButton
                icon={faPlus}
                onClick={showNew.toShow}
                text={t('quizQuestions.newQuestion')}
                displayTextBreakpoint="xs"
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
                        <DeleteToolbarButton onDelete={() => handleRemoveQuestion(question)} />
                        <ToolbarButton
                            icon={faPlus}
                            onClick={() => setQuestionToAddAnswer(question.id)}
                            text={t('quizQuestions.newAnswer')}
                        />
                    </>
                )}
                renderAnswerOptions={(answer) => (
                    <>
                        <ToolbarButton
                            icon={faEdit}
                            text={t('common.edit')}
                            displayTextBreakpoint="none"
                            onClick={() => setEditedAnswer(answer)}
                        />
                        <DeleteToolbarButton displayTextBreakpoint="none" onDelete={() => handleRemoveAnswer(answer)} />
                    </>
                )}
            />

            <QuestionFormModal
                title={t('quizQuestions.createQuestion')}
                show={showNew.show}
                renderGallery={renderGallery}
                onSave={handleNewQuestionSave}
                onCancel={showNew.toHide}
                isLoading={createQuestionMutation.isLoading}
            />

            <QuestionFormModal
                title={t('quizQuestions.editQuestion')}
                show={!!editedQuestion}
                editData={editedQuestion}
                renderGallery={renderGallery}
                onSave={handleUpdateQuestion}
                onCancel={() => setEditedQuestion(null)}
                isLoading={updateQuestionMutation.isLoading}
            />

            <AnswerFormModal
                title={t('quizQuestions.newAnswer')}
                show={questionToAddAnswer > -1}
                onSave={handleCreateAnswer}
                textError={textError}
                renderGallery={renderGallery}
                onCancel={() => setQuestionToAddAnswer(-1)}
                isLoading={createAnswerMutation.isLoading}
            />

            <AnswerFormModal
                title={t('quizQuestions.editAnswer')}
                editData={editedAnswer}
                show={!!editedAnswer}
                onSave={handleUpdateAnswer}
                textError={textError}
                renderGallery={renderGallery}
                onCancel={() => setEditedAnswer(null)}
                isLoading={updateAnswerMutation.isLoading}
            />
        </>
    );
}
