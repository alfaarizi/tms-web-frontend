import { useTranslation } from 'react-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/resources/instructor/Task';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { FormButtons } from '@/components/Buttons/FormButtons';
import {
    StructuralRequirementFormControl,
} from '@/pages/InstructorTaskManager/components/Tasks/StructuralRequirementFormControl';
import { FormError } from '@/components/FormError';
import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';

type Props = {
  title: string;
  onSave: (t: Task) => void;
  onCancel?: () => void;
  editData?: Task;
  isLoading: boolean;
  serversideError: ValidationErrorBody | null;
};

export function CanvasTaskForm({
    title,
    onSave,
    onCancel,
    editData,
    isLoading,
    serversideError,
}: Props) {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        control,
        clearErrors,
        setError,

        formState: { errors },
    } = useForm<Task>({
        defaultValues: editData,
    });
    useServersideFormErrors<Task>(clearErrors, setError, serversideError);

    const {
        fields: requirements,
        append: requirementAppend,
        remove: requirementRemove,
    } = useFieldArray({
        control,
        name: 'structuralRequirements',
    });

    const onSubmit = handleSubmit((data) => {
        onSave(data);
    });

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('task.structuralRequirement')}
                        :
                    </Form.Label>
                    {requirements.map((requirement, index) => (
                        <StructuralRequirementFormControl
                            key={requirement.id}
                            index={index}
                            register={register}
                            requirementRemove={requirementRemove}
                            errors={errors}
                        />
                    ))}
                    <div>
                        <ToolbarButton
                            icon={faPlus}
                            onClick={() => requirementAppend({ regexExpression: '', type: 'Includes' })}
                            text={t('common.add')}
                            displayTextBreakpoint="xs"
                        />
                    </div>
                    {serversideError?.regexExpression
                        && <FormError message={serversideError?.regexExpression[0]} /> }
                    <Form.Text className="text-muted">{t('task.structuralRequirementHelp')}</Form.Text>
                </Form.Group>
                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
