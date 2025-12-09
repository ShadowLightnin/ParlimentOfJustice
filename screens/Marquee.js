// // Marquee.js — FINAL VERSION (copy-paste this)
// import React, { useEffect, useRef, useState } from "react";
// import { Animated, Text, View, StyleSheet } from "react-native";

// const Marquee = ({ text = "", speed = 45, gap = 120 }) => {
//   const translateX = useRef(new Animated.Value(0)).current;
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [textWidth, setTextWidth] = useState(0);

//   const needsScrolling = textWidth > containerWidth;

//   useEffect(() => {
//     if (!needsScrolling || containerWidth === 0 || textWidth === 0) {
//       translateX.setValue(0);
//       translateX.stopAnimation();
//       return;
//     }

//     const distance = textWidth + gap;

//     translateX.setValue(0);

//     const anim = Animated.loop(
//       Animated.timing(translateX, {
//         toValue: -distance,
//         duration: (distance / speed) * 1000,
//         useNativeDriver: true,
//       })
//     );
//     anim.start();

//     return () => anim.stop();
//   }, [textWidth, containerWidth, needsScrolling, gap, speed]);

//   return (
//     <View
//       style={styles.window}
//       onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
//     >
//       {/* Always render the text once to measure it */}
//       <Text
//         style={styles.hiddenMeasurer}
//         onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
//       >
//         {text}
//       </Text>

//       {/* If it fits — just show it centered, no animation */}
//       {!needsScrolling ? (
//         <Text style={styles.textBehind} numberOfLines={1}>
//           {text}
//         </Text>
//       ) : (
//         /* Scrolling version — full text visible forever */
//         <Animated.View
//           style={{
//             flexDirection: "row",
//             transform: [{ translateX }],
//           }}
//         >
//           <Text style={styles.textBehind}>{text}</Text>
//           <View style={{ width: gap }} />
//           <Text style={styles.textBehind}>{text}</Text>
//           {/* Extra space so the end of the text never gets cut off */}
//           <View style={{ width: containerWidth }} />
//         </Animated.View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   window: {
//     height: 26,
//     overflow: "hidden",          // ← this is the magic
//     justifyContent: "center",
//     width: "100%",
//   },
//   hiddenMeasurer: {
//     position: "absolute",
//     opacity: 0,
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   textBehind: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#e9fbff",
//     backgroundColor: "black",
//     paddingHorizontal: 4,
//   },
// });

// export default Marquee;