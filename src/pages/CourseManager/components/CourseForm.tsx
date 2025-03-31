import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from 'components/FormError';
import { Course } from 'resources/common/Course';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';
import { AddUserFormControl, AddUserMode } from 'components/AddUsers/AddUserFormControl';
import { useSearchFacultyQuery } from 'hooks/common/UserHooks';
import { extractUserCodes } from 'utils/extractUserCodes';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { getSelectedUserCodes } from 'utils/getSelectedUserCodes';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useTextPaste } from 'ui-hooks/useTextPaste';

type Props = {
    onSave: (course: CreateOrUpdateCourse) => void,
    onCancel?: () => void
    editData?: Course,
    title: string,
    isLoading: boolean,
    serverSideErrors: ValidationErrorBody | null,
}

type CourseFormData = {
    name: string,
    codes: string,
    importedUserCodes: string,
    selectedUserCodes: Option[],
};

export function CourseForm({
    onSave,
    onCancel,
    editData,
    title,
    isLoading,
    serverSideErrors,
}: Props) {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<CourseFormData>();
    const { t } = useTranslation();

    useEffect(() => {
        if (editData) {
            setValue('name', editData.name);
            setValue('codes', editData.codes.join(', '));
        }
    }, [editData]);

    const [addLecturerModeToggle, setAddLecturerModeToggle] = useState<AddUserMode>('search');
    const [userSearchText, setUserSearchText] = useState<string>('');
    const [userSearchQueryEnabled, setUserSearchQueryEnabled] = useState<boolean>(false);
    const facultySearchQuery = useSearchFacultyQuery(userSearchText, userSearchQueryEnabled);

    // Custom error mapping is needed because the different field names and multiple error messages
    useEffect(() => {
        clearErrors('importedUserCodes');
        clearErrors('selectedUserCodes');

        const message = serverSideErrors?.lecturerUserCodes.join(' ');
        if (message) {
            const fieldName = addLecturerModeToggle === 'import' ? 'importedUserCodes' : 'selectedUserCodes';
            setError(fieldName, { message });
        }
    }, [serverSideErrors]);

    const handleToggleChange = () => {
        setAddLecturerModeToggle((prevState) => (prevState === 'search' ? 'import' : 'search'));
    };

    const handleSearch = (text: string) => {
        setUserSearchText(text);
        setUserSearchQueryEnabled(true);
    };

    const splitCourseCodes = (value: string) => value.split(',')
        .map((code) => code.trim())
        .filter((code) => code !== '')
        .filter((code, index, self) => self.indexOf(code) === index);

    const handleTextPaste = useTextPaste(setValue);

    const onSubmit = handleSubmit(async (courseData: CourseFormData) => {
        let lecturerUserCodes: string[] = [];
        if (!editData) {
            lecturerUserCodes = addLecturerModeToggle === 'search'
                ? getSelectedUserCodes(courseData.selectedUserCodes)
                : extractUserCodes(courseData.importedUserCodes);
        }

        const course: CreateOrUpdateCourse = {
            name: courseData.name,
            codes: splitCourseCodes(courseData.codes),
            lecturerUserCodes,
        };
        onSave(course);
    });

    const validateCourseCodes = (value: string) : string | undefined => {
        if (!value) {
            return undefined;
        }
        const invalidCodes = splitCourseCodes(value).filter((code) => code.length > 30);
        return invalidCodes.length > 0
            ? t('course.invalidCourseCodes', { maxLength: 30, codes: invalidCodes.join(', ') })
            : undefined;
    };

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {title}
                </CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('common.name')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('name', {
                            required: t('common.fieldRequired'),
                            maxLength: { value: 100, message: t('common.fieldMaxLength', { length: 100 }) },
                        })}
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    {errors.name && <FormError message={errors.name.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('course.codes')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {
                            ...register('codes', {
                                required: t('common.fieldRequired'),
                                validate: validateCourseCodes,
                            })
                        }
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    <Form.Text className="text-muted">
                        {t('course.separateCodes')}
                    </Form.Text>
                    {errors.codes && <FormError message={errors.codes.message} />}
                </Form.Group>

                {!editData && (
                    <Form.Group>
                        <Form.Label>
                            {t('course.lecturers')}
                            :
                        </Form.Label>
                        <AddUserFormControl
                            toggleValue={addLecturerModeToggle}
                            onToggle={handleToggleChange}
                            onPaste={handleTextPaste}
                            control={control}
                            id="course-lecturers"
                            onSearch={handleSearch}
                            searchData={facultySearchQuery.data}
                            isSearchLoading={facultySearchQuery.isLoading}
                            selectFieldName="selectedUserCodes"
                            importFieldName="importedUserCodes"
                            selectFieldErrorMessage={errors.selectedUserCodes?.message}
                            importFieldErrorMessage={errors.importedUserCodes?.message}
                        />
                    </Form.Group>
                )}

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
