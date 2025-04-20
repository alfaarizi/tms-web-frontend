import { useState } from 'react';
import { Dropdown, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IpRestrictionItem } from '@/resources/instructor/IpRestrictionItem';

type Props = {
    ipRestrictions: IpRestrictionItem[];
    selectedIpRestrictions: IpRestrictionItem[];
    handleIpRestrictionsChange: (selectedOptions: IpRestrictionItem[]) => void;
};

export function IpRestrictionDropdown({
    ipRestrictions,
    selectedIpRestrictions,
    handleIpRestrictionsChange,
}: Props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleCheckboxChange = (id: number) => {
        const isSelected = selectedIpRestrictions.find((restriction) => restriction.id === id);
        const updatedSelections = isSelected
            ? selectedIpRestrictions.filter((restriction) => restriction.id !== id)
            : [...selectedIpRestrictions, ipRestrictions.find((restriction) => restriction.id === id)!];
        handleIpRestrictionsChange(updatedSelections);
    };

    const toggleDropdown = (isOpen: boolean) => {
        setDropdownOpen(isOpen);
    };

    const { t } = useTranslation();

    return (
        <>
            <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-ip-restrictions">
                    {t('ipRestriction.selectAddresses')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {ipRestrictions.map((restriction) => (
                        <Dropdown.Item key={restriction.id} as="div">
                            <Form.Check
                                type="checkbox"
                                id={`checkbox-${restriction.id}`}
                                label={`${restriction.name}`}
                                checked={selectedIpRestrictions.some((r) => r.id === restriction.id)}
                                onChange={() => handleCheckboxChange(restriction.id)}
                            />
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <ListGroup className="mt-3">
                {selectedIpRestrictions.length ? t('ipRestriction.selectedAddresses') : ''}
                {selectedIpRestrictions.map((restriction) => (
                    <ListGroup.Item key={restriction.id}>
                        {restriction.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}
