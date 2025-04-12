import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { DateTime } from 'luxon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from '@/components/CustomCard/CustomCard';
import { FormError } from '@/components/FormError';
import { DualListBoxControl } from '@/pages/InstructorPlagiarism/components/DualListBoxControl';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { Course } from '@/resources/common/Course';
import { Semester } from '@/resources/common/Semester';
import { PlagiarismBasefile } from '@/resources/instructor/PlagiarismBasefile';
import { Task } from '@/resources/instructor/Task';
import { User } from '@/resources/common/User';
import { PlagiarismType } from '@/resources/instructor/PlagiarismType';
import { RequestPlagiarism } from '@/resources/instructor/RequestPlagiarism';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { useTextPaste } from '@/ui-hooks/useTextPaste';

export interface PlagiarismForm extends Omit<RequestPlagiarism, 'ignoreFiles'> {
    myTasks: boolean;
    courseID: number | 'All';
    semesterFromID: number;
    semesterToID: number;
    ignoreFiles: {name: string; id: string}[];
}

function formatBaseFileLabel(basefile: PlagiarismBasefile, appendDate: boolean) {
    let label = `${basefile.course?.name || '?'} / ${basefile.name}`;
    if (appendDate) {
        const date = DateTime.fromISO(basefile.lastUpdateTime).toLocaleString(DateTime.DATE_SHORT);
        label = `${label} / ${date}`;
    }
    return label;
}

function formatBaseFileList(basefiles: PlagiarismBasefile[]) {
    const formatted: { basefile: PlagiarismBasefile, label: string }[] = [];
    const duplicates = new Set<string>();
    for (let i = 0; i < basefiles.length; ++i) {
        const basefile = basefiles[i];
        let label = formatBaseFileLabel(basefile, false);
        let firstDupe;
        if (duplicates.has(label)) {
            // This is the at least third occurrance of the same
            // course-name combination, simply add the date suffix
            label = formatBaseFileLabel(basefile, true);
        // eslint-disable-next-line no-cond-assign
        } else if ((firstDupe = formatted.find((x) => x.label === label)) !== undefined) {
            // This is the exactly second occurrance of the same
            // course-name combination, add the suffix to the first
            // one as well, and remember that it’s a dupe
            duplicates.add(label);
            firstDupe.label = formatBaseFileLabel(firstDupe.basefile, true);
            label = formatBaseFileLabel(basefile, true);
        }
        formatted.push({ basefile, label });
    }
    return formatted.map((x) => ({ value: x.basefile.id, label: x.label }));
}

type Props = {
    onSave: (data: RequestPlagiarism) => void,
    onCancel: () => void,
    courses?: Course[],
    semesters?: Semester[],
    tasks?: Task[],
    users?: User[],
    basefiles?: PlagiarismBasefile[],
    semesterToID: number,
    semesterFromID: number,
    availableTypes?: PlagiarismType[],
    selectedType: PlagiarismType,
    isLoading: boolean,
}

export function NewRequestForm({
    courses,
    onSave,
    onCancel,
    semesterFromID,
    semesterToID,
    semesters,
    tasks,
    users,
    basefiles,
    availableTypes,
    selectedType,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        setValue,
        control,
        handleSubmit,

        formState: {
            errors,
        },
    } = useFormContext<PlagiarismForm>(); // retrieve all hook methods
    const ignoreFiles = useFieldArray({ name: 'ignoreFiles' });

    const handleTextPaste = useTextPaste(setValue);

    const obSubmit = handleSubmit((data) => onSave({
        ...data,
        ignoreFiles: data.ignoreFiles.map(({ name }) => name).filter((name) => name),
    }));

    const tasksList = tasks
        ?.map((task) => ({
            value: task.id,
            label: `${task.name} | ${task.group?.course.name} (${task.group?.number}) | ${task.semester?.name}`,
        }))
        || [];
    const userList = users?.map((user) => ({
        value: user.id,
        label: `${user.name ?? ''} <${user.userCode}>`,
    })) || [];
    const basefileList = basefiles ? formatBaseFileList(basefiles) : [];

    let typeSettings;
    switch (selectedType) {
    case 'moss':
        typeSettings = (
            <Form.Group>
                <Form.Label>
                    {t('plagiarism.moss.ignoreThreshold')}
                    :
                </Form.Label>
                <Form.Control
                    type="number"
                    min="2"
                    {...register(
                        'ignoreThreshold',
                        {
                            required: t('common.fieldRequired')
                                .toString(),
                            min: 2,
                        },
                    )}
                    size="sm"
                />
                <Form.Text className="text-muted">
                    {t('plagiarism.moss.ignoreThresholdHelp')}
                </Form.Text>
                {errors.ignoreThreshold && <FormError message={errors.ignoreThreshold.message} />}
            </Form.Group>
        );
        break;
    case 'jplag':
        typeSettings = (
            <>
                <Form.Group>
                    <Form.Label>
                        {t('plagiarism.jplag.tune')}
                        :
                    </Form.Label>
                    <Form.Control type="number" min="1" {...register('tune', { min: 1 })} size="sm" />
                    <Form.Text className="text-muted">
                        {t('plagiarism.jplag.tuneHelp')}
                    </Form.Text>
                    {errors.tune && <FormError message={errors.tune.message} />}
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        {t('plagiarism.jplag.ignoreFiles')}
                        :
                    </Form.Label>
                    {ignoreFiles.fields.map((field, index) => {
                        const ifErrors = errors.ignoreFiles && errors.ignoreFiles[index]?.name;
                        return (
                            <React.Fragment key={field.id}>
                                <InputGroup>
                                    <Form.Control
                                        {...register(`ignoreFiles.${index}.name`, {
                                            pattern: {
                                                value: /^[^\n\\/]+$/,
                                                message: t('plagiarism.jplag.ignoreFilesError'),
                                            },
                                        })}
                                        size="sm"
                                    />
                                    <DeleteToolbarButton
                                        displayTextBreakpoint="none"
                                        onDelete={() => ignoreFiles.remove(index)}
                                    />
                                </InputGroup>
                                {ifErrors && <FormError message={ifErrors.message} />}
                            </React.Fragment>
                        );
                    })}
                    <div>
                        <ToolbarButton
                            icon={faPlus}
                            onClick={() => ignoreFiles.append('')}
                            text={t('common.add')}
                            displayTextBreakpoint="xs"
                        />
                    </div>
                    <Form.Text className="text-muted">
                        {t('plagiarism.jplag.ignoreFilesHelp')}
                    </Form.Text>
                </Form.Group>
            </>
        );
        break;
    default:
        // should not happen
        typeSettings = null;
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('plagiarism.newPlagiarismCheck')}
                </CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={obSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('common.name')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('name', {
                            required: t('common.fieldRequired')
                                .toString(),
                        })}
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    {errors.name && <FormError message={errors.name.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('common.description')}
                        :
                    </Form.Label>
                    <Form.Control as="textarea" {...register('description', { required: false })} size="sm" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('plagiarism.type')}
                        :
                    </Form.Label>
                    {availableTypes?.map((type) => (
                        <Form.Check
                            type="radio"
                            id={`newplagiarism-type-${type}`}
                            key={type}
                            value={type}
                            label={t(`plagiarism.${type}.name`)}
                            {...register('type')}
                        />
                    ))}
                </Form.Group>

                {typeSettings}

                <hr />

                <Form.Group>
                    <Form.Label>
                        {t('course.course')}
                        :
                    </Form.Label>
                    <Form.Control as="select" {...register('courseID')} size="sm">
                        <option value="All">{t('common.all')}</option>
                        {courses?.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {t('plagiarism.from')}
                            :
                        </Form.Label>
                        <Form.Control as="select" {...register('semesterFromID')} size="sm">
                            {semesters?.filter((semester) => semester.id <= semesterToID)
                                .map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>
                            {t('plagiarism.to')}
                            :
                        </Form.Label>
                        <Form.Control as="select" {...register('semesterToID')} size="sm">
                            {semesters?.filter((semester) => semester.id >= semesterFromID)
                                .map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                </Form.Row>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="myTasks"
                        label={t('plagiarism.myTasks')}
                        {...register('myTasks')}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.tasks')}
                        :
                    </Form.Label>
                    <DualListBoxControl
                        control={control}
                        name="selectedTasks"
                        rules={{ validate: { notEmpty: (v: number[]) => v.length > 0 } }}
                        options={tasksList}
                    />
                    {errors.selectedTasks && <FormError message={t('plagiarism.tasksRequired')} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('common.students')}
                        :
                    </Form.Label>
                    <DualListBoxControl
                        control={control}
                        name="selectedStudents"
                        rules={{ validate: { notEmpty: (v: number[]) => v.length >= 2 } }}
                        options={userList}
                    />
                    {errors.selectedStudents && <FormError message={t('plagiarism.studentsRequired')} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('plagiarism.basefiles.basefiles')}
                        :
                    </Form.Label>
                    <DualListBoxControl
                        control={control}
                        name="selectedBasefiles"
                        options={basefileList}
                    />
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
