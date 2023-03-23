import React from 'react';
import { faClipboardList, faListCheck, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EvaluatorTemplate } from 'resources/instructor/EvaluatorTemplate';
import { useTranslation } from 'react-i18next';

import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';

type Props = {
    disabled: boolean,
    templates: EvaluatorTemplate[],
    setSelectedTemplate: (template: EvaluatorTemplate) => void,
}

export function TemplateListDropdownButton({ disabled, setSelectedTemplate, templates }: Props) {
    const { t } = useTranslation();

    return (
        <ToolbarDropdown
            text={t('task.evaluator.templates')}
            icon={faClipboardList}
            disabled={disabled}
        >
            {templates.map((template) => (
                <DropdownItem
                    className="w-100"
                    key={template.name}
                    onSelect={() => setSelectedTemplate(template)}
                >
                    <div className="d-flex justify-content-between w-100">
                        <span>
                            {template.name}
                        </span>
                        <span className="ml-3">
                            <FontAwesomeIcon
                                className={`fa-fw mr-1 ${!template.autoTest ? 'invisible' : ''}`}
                                icon={faListCheck}
                            />
                            <FontAwesomeIcon
                                className={`fa-fw ${!template.staticCodeAnalysis ? 'invisible' : ''}`}
                                icon={faMagnifyingGlassChart}
                                flip="horizontal"
                            />
                        </span>
                    </div>
                </DropdownItem>
            ))}
        </ToolbarDropdown>
    );
}
