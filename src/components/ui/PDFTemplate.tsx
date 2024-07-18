import React, { useState, useEffect } from 'react'
import { Page, Text, View, Document, Image, StyleSheet, Link } from '@react-pdf/renderer'
import html2canvas from 'html2canvas';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import headingImage from '../../../public/assets/pdfimages/1.png'
import secondImage from '../../../public/assets/pdfimages/2n.jpg'
import thirdImage from '../../../public/assets/pdfimages/3.png'
import lastImage from '../../../public/assets/pdfimages/last.png'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  textPage: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 30
  },
  section: {
    margin: 0.1,
    padding: 0.1,
    flexGrow: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  centerContent: {
    position: 'absolute',
    left: '15%',
    top: '40%',
    transform: 'translate(0%, -50%)',
    textAlign: 'center',
    width: '70%'
  },
  nameposition: {
    position: 'absolute',
    left: '7.5%',
    top: '87%',
    // transform: 'translate(0%, -50%)',
    textAlign: 'left',
    width: '85%',
    color: "white",
    fontWeight: "bold"
  },
  text: {
    fontSize: 16
  },
  nameText: {
    fontSize: 24,
  }
});

export default function PDFTemplate(props: any) {

  const [chartImage, setChartImage] = useState<any>();
  const [recommendationObj, setRecommendationObj] = useState<any>();

  useEffect(() => {
  }, [])

  useEffect(() => {
    html2canvas(document.getElementById("ChartElement")).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      setChartImage(image);
      // console.log("image:\n", image);
    });
  }, [document.getElementById("ChartElement").innerHTML.toString()])

  useEffect(() => {
    if (document.getElementById("recommendations").innerHTML != "") {
      setRecommendationObj(document.getElementById("recommendations"));
    }
  }, [document.getElementById("recommendations").innerHTML.toString()])

  const removeHtmlTags = (str: String) => {
    return str.replace(/<[^>]*>/g, '');
  }

  return (
    <Document>
      {/* <Page size="A4" style={styles.page}>
        <Image source={headingImage} style={styles.image} />
      </Page> */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={headingImage} style={styles.image} />
          <View style={styles.nameposition}>
            <Text style={styles.nameText}>{localStorage.getItem("firstname") + " " + localStorage.getItem("lastname")}</Text>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <Image source={secondImage} style={styles.image} />
      </Page>
      {/* <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={secondImage} style={styles.image} />
          <View style={styles.centerContent}>
            <Text style={styles.text}>(The information provided is intended for general informational purposes only. It is not a substitute for professional medical or psychological advice, diagnosis, or treatment. The results from this survey do not constitute a medical or psychological diagnosis. Always seek the advice of your physician or a qualified healthcare provider with any questions you may have regarding a medical or psychological condition. For the full terms and conditions, please visit our website  <Link style={{ color: "blue", textDecoration: "underline" }} src="http://www.beyondprofiler.com">http://www.beyondprofiler.com</Link>)</Text>
          </View>
        </View>
      </Page> */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={thirdImage} style={styles.image} />
          <View style={{
            position: 'absolute',
            left: '5%',
            top: '10%',
            // transform: 'translate(0%, -50%)',
            textAlign: 'center',
            width: '90%'
          }}
          >
            <Text style={{ fontSize: 48, color: '#FAA942' }}>Results</Text>
            <Text style={{ fontSize: 20, color: '#FAA942', marginTop: '36px' }}>
              {props.result}
            </Text>
            <Image style={{ marginTop: "36px", marginBottom: "36px", paddingTop: "24px", paddingBottom: "24px" }} source={chartImage} />
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.textPage} wrap>
        <View style={styles.section}>
          {
            recommendationObj && <>
              {
                Array.from(document.getElementById("recommendations")!.children).map((item: any, index: any) => {
                  return <View>
                    <Text key={index} style={{ padding: "12px", width: "100%", backgroundColor: "#2040B0", color: "#FFFFFF", marginTop: "12px" }}>
                      {(Array.from(item!.children)[1] as HTMLElement).innerHTML}
                    </Text>
                    {
                      Array.from((Array.from(item!.children)[2] as HTMLElement).children[0].children).map((sItem: any, index: any) => {
                        return <>
                          {
                            Array.from(sItem!.children).length == 0 ?
                              <Text style={{ fontSize: 10, color: "#444444", marginTop: "4px" }}>{removeHtmlTags(sItem.innerHTML.toString())}</Text> :
                              (Array.from(sItem!.children)[0] as HTMLElement).tagName == "STRONG" ?
                                <Text style={{ fontSize: 12, color: "#000000", fontWeight: "bold", marginTop: "12px" }}>{removeHtmlTags(sItem.innerHTML.toString())}</Text> :
                                (Array.from(sItem!.children)[0] as HTMLElement).tagName == "BR" ?
                                  <Text style={{ fontSize: 8, color: "#444444", }}>&nbsp;</Text> :
                                  <Text style={{ fontSize: 10, color: "#444444", marginTop: "4px" }}>{removeHtmlTags(sItem.innerHTML.toString())}</Text>
                          }
                        </>
                      })
                    }
                    <Text style={{ fontSize: 20 }}>&nbsp;</Text>
                  </View>
                })
              }
            </>
          }
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <Image source={lastImage} style={styles.image} />
      </Page>
    </Document>
  )
}
