import { ClipboardEvent, useCallback } from 'react';
import {
    FieldValues, UseFormSetValue, Path, PathValue,
} from 'react-hook-form';

/**
 * Trims pasted text for single-line text inputs and updates the field value
 * @param setValue React hook form function to update the field value
 */
export function useTextPaste<T extends FieldValues>(setValue: UseFormSetValue<T>) {
    return useCallback(
        (e: ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const paste = e.clipboardData.getData('text').trim();
            const {
                name, value, selectionStart, selectionEnd,
            } = e.currentTarget;
            if (selectionStart === null || selectionEnd === null) return;

            setValue(
                name as Path<T>,
                (value.slice(0, selectionStart) + paste + value.slice(selectionEnd)) as PathValue<T, Path<T>>,
            );

            e.currentTarget.setSelectionRange(selectionStart + paste.length, selectionStart + paste.length);
        },
        [setValue],
    );
}
