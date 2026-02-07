import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Registration } from '@/types/registration';

// Register Thai Font (Sarabun)
Font.register({
    family: 'Sarabun',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/sarabun@4.5.0/files/sarabun-thai-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/sarabun@4.5.0/files/sarabun-thai-700-normal.woff', fontWeight: 'bold' }
    ]
});

// --- Modern & Gorgeous Styles ---
const styles = StyleSheet.create({
    page: {
        paddingTop: 0, // ชิดขอบบนสำหรับ Header สีเต็ม
        paddingBottom: 60,
        paddingHorizontal: 0,
        fontFamily: 'Sarabun',
        fontSize: 10,
        backgroundColor: '#FFFFFF',
        color: '#334155'
    },
    // 1. Header Area
    headerContainer: {
        backgroundColor: '#1e1b4b', // Indigo 950 (Deep Blue)
        paddingVertical: 30,
        paddingHorizontal: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerTitleBlock: {
        flexDirection: 'column'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#818cf8', // Indigo 400
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 4
    },
    headerMetaBlock: {
        alignItems: 'flex-end'
    },
    headerMetaText: {
        fontSize: 9,
        color: '#c7d2fe', // Indigo 200
        marginBottom: 2
    },

    // 2. Summary Cards (Dashboard style)
    summarySection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginHorizontal: 40,
        marginBottom: 15
    },
    summaryCard: {
        width: 100,
        padding: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 6,
        alignItems: 'center'
    },
    summaryLabel: {
        fontSize: 8,
        color: '#64748b',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 4
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a'
    },

    // 3. Table Styling
    tableContainer: {
        marginHorizontal: 40,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 6,
        overflow: 'hidden'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9', // Slate 100
        borderBottomColor: '#cbd5e1',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 35,
    },
    headerText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#475569',
        textTransform: 'uppercase'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#f1f5f9',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 42, // เพิ่มความสูงแถวให้อ่านสบาย
    },
    tableRowAlt: {
        backgroundColor: '#f8fafc' // Zebra Stripe (สีเทาอ่อนสลับขาว)
    },

    // Columns Configuration
    colNo: { width: '5%', textAlign: 'center' },
    colBib: { width: '12%', paddingLeft: 10 },
    colName: { width: '30%' },
    colCategory: { width: '10%', textAlign: 'center' },
    colSize: { width: '8%', textAlign: 'center' },
    colPhone: { width: '15%', textAlign: 'center' },
    colStatus: { width: '12%', alignItems: 'center', justifyContent: 'center' },
    colCheckIn: { width: '8%', alignItems: 'center', justifyContent: 'center' },

    // Text Content Styles
    bibText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1e293b',
        fontFamily: 'Sarabun'
    },
    nameTh: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1e293b'
    },
    nameEn: {
        fontSize: 9,
        color: '#64748b',
        marginTop: 1
    },

    // Status Badges (Pills)
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    // Colors for Badges
    bgApproved: { backgroundColor: '#dcfce7' }, // Green-100
    textApproved: { color: '#166534' },         // Green-700

    bgPending: { backgroundColor: '#ffedd5' },  // Orange-100
    textPending: { color: '#9a3412' },          // Orange-700

    bgRejected: { backgroundColor: '#fee2e2' }, // Red-100
    textRejected: { color: '#991b1b' },         // Red-700

    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8'
    },
    pageNumber: {
        fontSize: 8,
        color: '#64748b',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    }
});

interface RunnerReportPDFProps {
    data: Registration[];
}

const RunnerReportPDF = ({ data }: RunnerReportPDFProps) => {
    const generatedDate = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate Summary Stats
    const total = data.length;
    const approved = data.filter(r => r.status === 'approved').length;
    const checkedIn = data.filter(r => r.kit_picked_up).length;

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>

                {/* 1. Gorgeous Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleBlock}>
                        <Text style={styles.headerTitle}>MANGROVE RUN 2026</Text>
                        <Text style={styles.headerSubtitle}>Official Runner Registration Report</Text>
                    </View>
                    <View style={styles.headerMetaBlock}>
                        <Text style={styles.headerMetaText}>Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
                        <Text style={styles.headerMetaText}>Generated: {generatedDate}</Text>
                    </View>
                </View>

                {/* 2. Summary Dashboard */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Runners</Text>
                        <Text style={styles.summaryValue}>{total}</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Approved</Text>
                        <Text style={[styles.summaryValue, { color: '#166534' }]}>{approved}</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Picked Up</Text>
                        <Text style={[styles.summaryValue, { color: '#0369a1' }]}>{checkedIn}</Text>
                    </View>
                </View>

                {/* 3. Data Table */}
                <View style={styles.tableContainer}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerText, styles.colNo]}>No.</Text>
                        <Text style={[styles.headerText, styles.colBib]}>BIB Number</Text>
                        <Text style={[styles.headerText, styles.colName]}>Full Name</Text>
                        <Text style={[styles.headerText, styles.colCategory]}>Category</Text>
                        <Text style={[styles.headerText, styles.colSize]}>Size</Text>
                        <Text style={[styles.headerText, styles.colPhone]}>Phone</Text>
                        <Text style={[styles.headerText, styles.colStatus]}>Status</Text>
                        <Text style={[styles.headerText, styles.colCheckIn]}>Kit</Text>
                    </View>

                    {/* Rows */}
                    {data.map((runner, index) => {
                        const isEven = index % 2 === 0;
                        const statusStyle =
                            runner.status === 'approved' ? [styles.bgApproved, styles.textApproved] :
                                runner.status === 'pending' ? [styles.bgPending, styles.textPending] :
                                    [styles.bgRejected, styles.textRejected];

                        return (
                            <View key={runner.id} style={[styles.tableRow, !isEven ? styles.tableRowAlt : {}]}>
                                <Text style={styles.colNo}>{index + 1}</Text>

                                <View style={styles.colBib}>
                                    <Text style={styles.bibText}>{runner.bib_number || '-'}</Text>
                                </View>

                                <View style={styles.colName}>
                                    <Text style={styles.nameTh}>{runner.full_name_th}</Text>
                                    <Text style={styles.nameEn}>{runner.full_name_en}</Text>
                                </View>

                                <Text style={styles.colCategory}>{runner.race_category}</Text>
                                <Text style={styles.colSize}>{runner.shirt_size}</Text>
                                <Text style={styles.colPhone}>{runner.phone}</Text>

                                {/* Status Badge */}
                                <View style={styles.colStatus}>
                                    <View style={[styles.badge, statusStyle[0]]}>
                                        <Text style={statusStyle[1]}>{runner.status.toUpperCase()}</Text>
                                    </View>
                                </View>

                                {/* Check-in Status */}
                                <View style={styles.colCheckIn}>
                                    <Text style={{ fontSize: 10, color: runner.kit_picked_up ? '#166534' : '#cbd5e1' }}>
                                        {runner.kit_picked_up ? '✓' : '-'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* 4. Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Confidential Document • For Internal Use Only</Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </View>
            </Page>
        </Document>
    );
};

export default RunnerReportPDF;