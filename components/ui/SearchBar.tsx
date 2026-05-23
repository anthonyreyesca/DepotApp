import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, shared } from '../../constants/theme';

interface SearchBarAction {
    label: string;
    style: 'blue' | 'green' | 'red';
    onPress: () => void;
}

interface SearchBarProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    actions?: SearchBarAction[];
}

export default function SearchBar({
    label,
    value,
    onChangeText,
    placeholder = 'Search...',
    actions = [],
}: SearchBarProps) {
    const btnStyle = (style: SearchBarAction['style']) => {
        if (style === 'green') return shared.btnGreen;
        if (style === 'red')   return shared.btnRed;
        return shared.btnBlue;
    };

    return (
        <View style={shared.searchBar}>
            {label && <Text style={shared.searchBarLabel}>{label}</Text>}
            <TextInput
                style={shared.searchInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="characters"
            />
            {actions.map((action, i) => (
                <TouchableOpacity key={i} style={btnStyle(action.style)} onPress={action.onPress}>
                    <Text style={shared.btnTextSm}>{action.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
