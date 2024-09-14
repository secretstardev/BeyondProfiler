import React, { useState, useEffect } from 'react'
import { Page, Text, View, Document, Image, StyleSheet, Link } from '@react-pdf/renderer'
import html2canvas from 'html2canvas';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import headingImage from '../../../public/assets/pdfimages/1.png'
import secondImage from '../../../public/assets/pdfimages/2n.jpg'
import thirdImage from '../../../public/assets/pdfimages/3.png'
import resultPageImage from '../../../public/assets/pdfimages/resultbgimage.jpg'
import lastImage from '../../../public/assets/pdfimages/last.png'
import attention1 from '../../../public/assets/pdfimages/attention1.png'
import attention2 from '../../../public/assets/pdfimages/attention2.png'
import attention3 from '../../../public/assets/pdfimages/attention3.png'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  textPage: {
    flexDirection: 'column',
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
  image2: {
    width: '100%',
    height: '30%'
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
    top: '85%',
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
    fontSize: 20,
  }
});

export default function PDFTemplate(props: any) {

  const [chartImage, setChartImage] = useState<any>();
  const [recommendationObj, setRecommendationObj] = useState<any>();
  const [imgHeights, setImgHeights] = useState<any>(undefined);

  const chartElement = document.getElementById("ChartElement2");
  useEffect(() => {

    const func = async () => {
      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/beyondprofiler.appspot.com/o/survey%20card.png?alt=media&token=474fefa0-0d55-4b95-af4a-621806816691'; // Replace with your image URL


      console.log((await getImageDimensions(imageUrl)));
    }

    func();

  }, [])

  useEffect(() => {

    if (chartElement) { // Check if element is not null
      html2canvas(chartElement).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        setChartImage(image);
        // console.log("chartimage:\n", image);
      });
    }

  }, [chartElement ? chartElement.innerHTML.toString() : ''])

  useEffect(() => {
    if (chartElement?.innerHTML != "") {
      setRecommendationObj(document.getElementById("recommendations"));
    }
  }, [chartElement ? chartElement.innerHTML.toString() : ''])

  const removeHtmlTags = (str: String) => {
    return str.replace(/<[^>]*>/g, '').replace("&nbsp;", "");
  }

  const getImageSource = (str: any) => {
    let srcValue = "";
    const htmlString = str.toString();

    // Create a new DOMParser instance
    const parser = new DOMParser();

    // Parse the HTML string into a Document
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Query the first <img> element
    const imgElement = doc.querySelector('img');

    if (imgElement && imgElement.getAttribute('src')) {
      // Get the src attribute value of the <img> element

      srcValue = imgElement.getAttribute('src') || "";
    } else {
      console.log('No img element found in the provided HTML string.');
    }
    return srcValue;
  }

  const getImageDimensions = (imageUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.onload = () => {
        resolve(img.height / img.width);
      };
      img.onerror = reject;
    });
  };

  const setImageProperties = async () => {
    const imgCnt = recommendationObj.getElementsByTagName('img').length;
    let heights: any = {};
    for (let i = 0; i < imgCnt; i++) {
      const element = recommendationObj.getElementsByTagName('img')[i] as HTMLElement;
      const elementSrc = getImageSource(element.outerHTML.toString());
      const elementDimension = await getImageDimensions(elementSrc);
      heights[elementSrc] = Math.min(Math.floor(elementDimension * 210 / 297 * 0.99 * 100), 85);
    }
    console.log(heights);
    setImgHeights(heights);
    props.setProgress(false);
  }

  useEffect(() => {
    if (recommendationObj && recommendationObj.innerHTML) {
      // recommendationObj.addEventListener('load', recommendationObjOnLoadEvent);
      const imgCnt = recommendationObj.getElementsByTagName('img').length
      console.log("Image count:\n", imgCnt);
      if (imgCnt > 0) {
        setImageProperties();
      }
    }
  }, [recommendationObj?.innerHTML.toString()])

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={headingImage} style={styles.image} />
          <View style={styles.nameposition}>
            <Text style={styles.nameText}>{props.resultInfo?.childname + "  " + props.resultInfo?.childbirthday}</Text>
            <Text style={{ fontSize: 12 }}>{props.resultInfo?.completedAt}</Text>
            <Text style={{ fontSize: 16 }}>{"Completed by: " + localStorage.getItem("firstname") + "  " + localStorage.getItem("lastname")}</Text>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <Image source={secondImage} style={styles.image} />
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={resultPageImage} style={styles.image} />
          <View style={{
            position: 'absolute',
            left: '5%',
            top: '20%',
            // transform: 'translate(0%, -50%)',
            textAlign: 'center',
            width: '90%'
          }}
          >
            <View style={{ paddingTop: "4px" }}>
              <Image style={{ marginTop: "4px", marginBottom: "4px", padding: "1px" }} source={chartImage} />
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ width: "23%", padding: "4px", backgroundColor: "white", border: " 1px solid #97D1A5" }}>
                <Text style={{ fontSize: 10, fontWeight: "extrabold", textAlign: 'left' }}>
                  <Text style={{ textDecoration: "underline" }}>24 and below</Text> :
                </Text>
                <Text style={{ fontSize: 8, marginTop: "4px", textAlign: 'left' }}>
                  {props.survey?.result25.split("\n").map((item: any) => {
                    return <>{item} <br /></>
                  })}
                </Text>
              </View>
              <View style={{ width: "23%", padding: "4px", backgroundColor: "white", border: " 1px solid #97D1A5" }}>
                <Text style={{ fontSize: 10, fontWeight: "extrabold", textAlign: 'left' }}>
                  <Text style={{ textDecoration: "underline" }}>Between 25 and 50</Text> :
                </Text>
                <Text style={{ fontSize: 8, marginTop: "4px", textAlign: 'left' }}>
                  {props.survey?.result50.split("\n").map((item: any) => {
                    return <>{item} <br /></>
                  })}
                </Text>
              </View>
              <View style={{ width: "23%", padding: "4px", backgroundColor: "white", border: " 1px solid #97D1A5" }}>
                <Text style={{ fontSize: 10, fontWeight: "extrabold", textAlign: 'left' }}>
                  <Text style={{ textDecoration: "underline" }}>Between 51 and 75</Text> :
                </Text>
                <Text style={{ fontSize: 8, marginTop: "4px", textAlign: 'left' }}>
                  {props.survey?.result75.split("\n").map((item: any) => {
                    return <>{item} <br /></>
                  })}
                </Text>
              </View>
              <View style={{ width: "23%", padding: "4px", backgroundColor: "white", border: " 1px solid #97D1A5" }}>
                <Text style={{ fontSize: 10, fontWeight: "extrabold", textAlign: 'left' }}>
                  <Text style={{ textDecoration: "underline" }}>Between 76 and above</Text> :
                </Text>
                <Text style={{ fontSize: 8, marginTop: "4px", textAlign: 'left' }}>
                  {props.survey?.result100.split("\n").map((item: any) => {
                    return <>{item} <br /></>
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
      {
        (recommendationObj) && <>
          {
            Array.from(document.getElementById("recommendations")!.children).map((item: any, index: any) => {
              return <Page size="A4" style={styles.textPage} wrap key={index}>
                <Text key={index} style={{ padding: "12px", width: "100%", backgroundColor: "#2040B0", color: "#FFFFFF", marginTop: "12px" }}>
                  {(Array.from(item!.children)[1] as HTMLElement).innerHTML}
                </Text>
                {
                  Array.from(
                    (Array.from(item!.children || [])[2] as HTMLElement || { children: [] }).children[0]?.children || []
                  ).map((sItem: any, index: any) => {
                    return <>
                      {
                        Array.from(sItem!.children).length == 0 ?
                          <Text style={{ fontSize: 10, color: "#444444", marginTop: "4px" }}>{removeHtmlTags(sItem.innerHTML.toString())}</Text> :
                          (Array.from(sItem!.children)[0] as HTMLElement).tagName == "IMG" ?
                            // <View style={{ width: "100%", height: `${imgHeights[getImageSource((Array.from(sItem!.children)[0] as HTMLElement).outerHTML)]}%` }}></View>
                            imgHeights && <Image source={`https://images.weserv.nl/?url=${encodeURIComponent(getImageSource((Array.from(sItem!.children)[0] as HTMLElement).outerHTML))}`} style={{ marginBottom: 10, width: "100%", height: `${imgHeights[getImageSource((Array.from(sItem!.children)[0] as HTMLElement).outerHTML)] + 5}%` }} />

                            :
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
              </Page>
            })
          }
        </>
      }
      <Page size="A4" style={styles.page}>
        <Image source={lastImage} style={styles.image} />
      </Page>
    </Document>
  )
}


/*


{
        (recommendationObj) && <>
          {
            Array.from(document.getElementById("recommendations")!.children).map((item: any, index: any) => {
              return <Page size="A4" style={styles.textPage} wrap key={index}>
                <View style={styles.section}>
                  <View>
                    <Text key={index} style={{ padding: "12px", width: "100%", backgroundColor: "#2040B0", color: "#FFFFFF", marginTop: "12px" }}>
                      {(Array.from(item!.children)[1] as HTMLElement).innerHTML}
                    </Text>
                    {
                      Array.from(
                        (Array.from(item!.children || [])[2] as HTMLElement || { children: [] }).children[0]?.children || []
                      ).map((sItem: any, index: any) => {
                        return <>
                          {
                            Array.from(sItem!.children).length == 0 ?
                              <Text style={{ fontSize: 10, color: "#444444", marginTop: "4px" }}>{removeHtmlTags(sItem.innerHTML.toString())}</Text> :
                              (Array.from(sItem!.children)[0] as HTMLElement).tagName == "IMG" ?
                                // <View style={{ width: "100%", height: `${imgHeights[getImageSource((Array.from(sItem!.children)[0] as HTMLElement).outerHTML)]}%` }}></View>
                                imgHeights && <Image source={`https://images.weserv.nl/?url=${encodeURIComponent(getImageSource((Array.from(sItem!.children)[0] as HTMLElement).outerHTML))}`} style={{ marginBottom: 10, width: "100%", height: `${imgHeights[getImageSource((Array.from(sItem!.children)[0] as HTMLElement).outerHTML)] + 5}%` }} />

                                :
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
                </View>
              </Page>
            })
          }
        </>
      }
*/
