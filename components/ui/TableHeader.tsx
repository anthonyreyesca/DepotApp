import React from 'react';
import { Text, View } from 'react-native';
import { shared } from '../../constants/theme';

export interface ColDef {
    label: string;
    width: `${number}%`;
    last?: boolean;
}

interface TableHeaderProps {
    columns: ColDef[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
    return (
        <View style={shared.tableHeader}>
            {columns.map((col, i) => (
                <View
                    key={i}
                    style={[shared.th, { width: col.width }, col.last && { borderRightWidth: 0 }]}
                >
                    <Text style={shared.thText}>{col.label}</Text>
                </View>
            ))}
        </View>
    );
}
