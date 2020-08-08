import React from 'react'
import { Document, Page, Text, Font, StyleSheet } from '@react-pdf/renderer'
import { PDFViewer } from '@react-pdf/renderer';


const ContractPdf = () => (
    <div id="row" style={{height: "100vh", width: "100vw", display: "flex", overflow: "hidden"}}>

    <PDFViewer width={'98%'} >
        <Document>
            <Page size="A4" style={styles.body}>
                <Text style={styles.header} fixed>
                    
                </Text>
                <Text style={styles.title}></Text>
                <Text style={styles.author}></Text>
                <Text style={styles.subtitle}>

                </Text>
                <Text style={styles.text}>

                </Text>
                <Text style={styles.text}>

                </Text>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    </PDFViewer>
    </div>
);

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald'
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    view: {
        width: '100%',
        height: '100%',
        padding: 0,
        backgroundColor: 'white',
    },
});


export default ContractPdf