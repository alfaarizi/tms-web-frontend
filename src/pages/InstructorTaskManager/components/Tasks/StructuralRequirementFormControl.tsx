import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { FormError } from '@/components/FormError';
import { Task } from '@/resources/instructor/Task';

type Props = {
    index: number;
    register: UseFormRegister<Task>;
    requirementRemove: (index: number) => void;
    errors: FieldErrors<Task>;
};

export function StructuralRequirementFormControl({
    index,
    register,
    requirementRemove,
    errors,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="mb-2">
            <InputGroup>
                <Form.Control
                    {...register(`structuralRequirements.${index}.type`, {
                        required: t('common.fieldRequired')
                            .toString(),
                    })}
                    as="select"
                    size="sm"
                    className="mr-2"
                >
                    <option value="Includes">{t('task.includes')}</option>
                    <option value="Excludes">{t('task.excludes')}</option>
                </Form.Control>
                <Form.Control
                    {...register(`structuralRequirements.${index}.regexExpression`, {
                        required: t('common.fieldRequired')
                            .toString(),
                    })}
                    placeholder={t('task.regularExpression')}
                    size="sm"
                    className="mr-2"
                />
                <DeleteToolbarButton
                    displayTextBreakpoint="none"
                    onDelete={() => requirementRemove(index)}
                />
            </InputGroup>
            {errors.structuralRequirements?.[index]?.regexExpression
                        && <FormError message={errors.structuralRequirements[index].regexExpression.message} />}
        </div>
    );
}
