import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { shared } from '../../constants/theme';

interface Option {
    id: string;
    label: string;
}

interface SelectorChipsProps {
    label: string;
    options: Option[];
    selected: string;
    onSelect: (id: string) => void;
    /** When true each chip stretches equally (good for 2-option rows) */
    stretch?: boolean;
}

export default function SelectorChips({
    label,
    options,
    selected,
    onSelect,
    stretch = false,
}: SelectorChipsProps) {
    return (
        <>
            <Text style={shared.formLabel}>{label}</Text>
            <View style={shared.selectorRow}>
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt.id}
                        style={[
                            shared.selectorChip,
                            stretch && { flex: 1 },
                            selected === opt.id && shared.selectorChipActive,
                        ]}
                        onPress={() => onSelect(opt.id)}
                    >
                        <Text
                            style={[
                                shared.selectorChipText,
                                selected === opt.id && shared.selectorChipTextActive,
                            ]}
                        >
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
}
