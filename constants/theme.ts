import { Platform, StatusBar, StyleSheet } from 'react-native';

// ─── DESIGN COLORS ───────────────────────────────────────────────
export const Colors = {
    brand: '#5577EE',
    brandDark: '#3355CC',
    brandBg: '#EEF1FF',
    dark: '#2A2A2A',
    darkMid: '#444',
    darkBorder: '#555',
    grayBg: '#EEEEEE',
    grayLight: '#E0E0E0',
    grayMid: '#CCCCCC',
    white: '#FFFFFF',
    green: '#4CAF50',
    red: '#F44336',
    orange: '#FF9800',
    brown: '#795548',
    kiosk: '#000000',
    kioskAccent: '#FFD700',
    text: '#333333',
    textMuted: '#666666',
    textLight: '#999999',
    placeholder: '#888888',
} as const;

// ─── SHARED STYLES ──────────────────────────────────────────────────
export const shared = StyleSheet.create({
    // Screen wrapper
    screen: {
        flex: 1,
        backgroundColor: Colors.grayBg,
    },

    // ── Header (all screens except kiosk) ──
    header: {
        height: 60,
        backgroundColor: Colors.dark,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    headerDashboard: {
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 40, 
        height: Platform.OS === 'android' ? 85 : 95, 
        backgroundColor: Colors.dark,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        flex: 1,
    },
    headerBadge: {
        backgroundColor: Colors.brand,
        color: Colors.white,
        fontSize: 9,
        fontWeight: 'bold',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 2,
        overflow: 'hidden',
        letterSpacing: 0.6,
        marginRight: 6,
    },
    backBtn: {
        backgroundColor: Colors.darkMid,
        borderWidth: 1,
        borderColor: Colors.darkBorder,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 3,
    },
    backBtnText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    logoutBtn: {
        backgroundColor: Colors.darkMid,
        borderWidth: 1,
        borderColor: Colors.darkBorder,
        padding: 7,
        borderRadius: 3,
    },

    // ── Search bar ──
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 8,
        backgroundColor: Colors.grayBg,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    searchBarLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.text,
        minWidth: 90,
    },
    searchInput: {
        flex: 1,
        height: 34,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#AAA',
        borderRadius: 3,
        paddingHorizontal: 8,
        fontSize: 13,
        fontWeight: 'bold',
    },

    // ── Action buttons ──
    btnBlue: {
        backgroundColor: Colors.brand,
        height: 34,
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 3,
    },
    btnGreen: {
        backgroundColor: Colors.green,
        height: 34,
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 3,
    },
    btnRed: {
        backgroundColor: Colors.red,
        height: 34,
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 3,
    },
    btnTextSm: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: 'bold',
    },

    // ── Table ──
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.brand,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    th: {
        borderRightWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 9,
        justifyContent: 'center' as const,
    },
    thText: {
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center' as const,
        fontSize: 10,
        letterSpacing: 0.4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#DDD',
        minHeight: 44,
        backgroundColor: '#E8E8E8',
    },
    tableRowAlt: {
        backgroundColor: '#EFEFEF',
    },
    tableRowSelected: {
        backgroundColor: '#B8CCFF',
    },
    tableRowInactive: {
        backgroundColor: '#AAAAAA',
        opacity: 0.85,
    },
    td: {
        borderRightWidth: 1,
        borderColor: '#DDD',
        justifyContent: 'center' as const,
        paddingHorizontal: 3,
    },
    tdText: {
        color: Colors.text,
        textAlign: 'center' as const,
        fontSize: 12,
    },
    tdTextBold: {
        color: '#000',
        textAlign: 'center' as const,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tdTextInactive: {
        color: '#666',
        fontStyle: 'italic' as const,
        textDecorationLine: 'line-through' as const,
    },

    // ── Status badges ──
    badgeAv: {
        backgroundColor: '#CCFFCC',
        color: '#006600',
        borderWidth: 1,
        borderColor: '#006600',
        fontSize: 9,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 2,
        overflow: 'hidden' as const,
        textAlign: 'center' as const,
    },
    badgeDam: {
        backgroundColor: '#FFCCCC',
        color: '#880000',
        borderWidth: 1,
        borderColor: '#880000',
        fontSize: 9,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 2,
        overflow: 'hidden' as const,
        textAlign: 'center' as const,
    },

    // ── Form styles ──
    formContainer: {
        padding: 16,
    },
    formLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 5,
        letterSpacing: 0.5,
    },
    formInput: {
        backgroundColor: Colors.white,
        height: 46,
        borderWidth: 1,
        borderColor: '#999',
        paddingHorizontal: 12,
        fontSize: 18,
        borderRadius: 3,
        fontWeight: 'bold',
        marginBottom: 14,
    },
    selectorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 14,
    },
    selectorChip: {
        backgroundColor: Colors.grayLight,
        borderWidth: 1,
        borderColor: '#BBB',
        borderRadius: 3,
        paddingVertical: 9,
        paddingHorizontal: 12,
        alignItems: 'center' as const,
    },
    selectorChipActive: {
        backgroundColor: Colors.brand,
        borderColor: Colors.brandDark,
    },
    selectorChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.text,
    },
    selectorChipTextActive: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    confirmBtn: {
        height: 56,
        borderRadius: 3,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginTop: 8,
        elevation: 3,
    },
    confirmBtnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.8,
    },

    // ── Empty / loading ──
    emptyText: {
        textAlign: 'center' as const,
        marginTop: 40,
        fontSize: 13,
        color: Colors.textLight,
        fontStyle: 'italic' as const,
    },
    locationText: {
        color: '#0055AA',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        fontSize: 12,
    },
});
