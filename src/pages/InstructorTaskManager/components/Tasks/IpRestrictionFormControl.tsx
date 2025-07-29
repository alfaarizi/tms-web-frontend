import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IpRestrictionItem } from '@/resources/instructor/IpRestrictionItem';
import {
    FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue,
} from 'react-hook-form';
import { Task } from '@/resources/instructor/Task';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { FormError } from '@/components/FormError';

type Props = {
    labIps: IpRestrictionItem[];
    register: UseFormRegister<Task>;
    setValue: UseFormSetValue<Task>;
    getValues: UseFormGetValues<Task>;
    index: number;
    ipRestrictionRemove: (index: number) => void;
    errors: FieldErrors<Task>
};

export function IpRestrictionFormControl({
    labIps,
    register,
    setValue,
    getValues,
    index,
    ipRestrictionRemove,
    errors,
}: Props) {
    const { t } = useTranslation();

    const loadId = () => {
        const ipAddress = getValues(`ipRestrictions.${index}.ipAddress`);
        const ipMask = getValues(`ipRestrictions.${index}.ipMask`);
        const officialIp = labIps.find((labIp) => labIp.ipAddress === ipAddress && labIp.ipMask === ipMask);
        if (officialIp) {
            return officialIp.id;
        }
        if (ipAddress && ipMask) {
            return labIps.length + 1;
        }
        return -1;
    };

    const [selectedRoomId, setSelectedRoomId] = useState(loadId());

    const roomIdChangedHandler = (roomId: number) => {
        setValue(`ipRestrictions.${index}.id`, roomId);
        if (roomId === -1) {
            setValue(`ipRestrictions.${index}.ipAddress`, '');
            setValue(`ipRestrictions.${index}.ipMask`, '');
        } else {
            const labIpItem = labIps.find((labIp) => labIp.id === roomId);
            if (!labIpItem) { return; }
            setValue(`ipRestrictions.${index}.ipAddress`, labIpItem.ipAddress);
            setValue(`ipRestrictions.${index}.ipMask`, labIpItem.ipMask);
        }
    };

    const validateIp = (ipAddress: string) => {
        const ipRestrictions = getValues('ipRestrictions');
        if (!ipRestrictions) return true;
        const ipMask = getValues(`ipRestrictions.${index}.ipMask`);
        const hits = ipRestrictions?.filter(
            (restriction) => restriction.ipAddress === ipAddress && restriction.ipMask === ipMask,
        );

        return hits.length === 1 || t('ipRestriction.duplicateIpError');
    };

    return (
        <div className="mb-2">
            <InputGroup>
                <Form.Control
                    as="select"
                    size="sm"
                    className="mr-2"
                    value={selectedRoomId}
                    onChange={(e) => {
                        setSelectedRoomId(parseInt(e.target.value, 10));
                        roomIdChangedHandler(parseInt(e.target.value, 10));
                    }}
                >
                    <option value={-1} disabled>{t('ipRestriction.selectDefault')}</option>
                    {labIps.map((ipRest) => <option value={ipRest.id}>{ipRest.name}</option>)}
                    <option value={labIps.length + 1}>{t('ipRestriction.custom')}</option>
                </Form.Control>
                <Form.Control
                    {...register(`ipRestrictions.${index}.ipAddress`, {
                        required: t('common.fieldRequired')
                            .toString(),
                        validate: validateIp,
                    })}
                    placeholder={t('ipRestriction.ipAddress')}
                    size="sm"
                    className="mr-2"
                    disabled={selectedRoomId <= labIps.length}
                />
                <Form.Control
                    {...register(`ipRestrictions.${index}.ipMask`, {
                        required: t('common.fieldRequired')
                            .toString(),
                    })}
                    placeholder={t('ipRestriction.ipMask')}
                    size="sm"
                    className="mr-2"
                    disabled={selectedRoomId <= labIps.length}
                />
                <DeleteToolbarButton
                    displayTextBreakpoint="none"
                    onDelete={() => ipRestrictionRemove(index)}
                />
            </InputGroup>
            {errors.ipRestrictions?.[index]?.ipAddress
                        && <FormError message={errors.ipRestrictions[index].ipAddress.message} />}
        </div>
    );
}
