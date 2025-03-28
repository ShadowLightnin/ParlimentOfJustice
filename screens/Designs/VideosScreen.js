import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  Modal,
} from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { preloadedVideos } from "../../HardCoded/preloadedVideos";

const VideosScreen = () => {
  const navigation = useNavigation();
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [userRole, setUserRole] = useState("viewer");
  const [backgroundVideo, setBackgroundVideo] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null); // Track video for full-screen modal
  const videoRefs = useRef({});

  useEffect(() => {
    fetchUploadedVideos();
    fetchUserRole();
    if (preloadedVideos.length > 0) {
      setBackgroundVideo(preloadedVideos[0]);
    }
  }, []);

  const fetchUserRole = async () => {
    if (!auth.currentUser) return;
    const userQuery = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const userSnap = await getDocs(userQuery);
    if (userSnap.docs.length > 0) {
      setUserRole(userSnap.docs[0].data().role || "viewer");
    }
  };

  const fetchUploadedVideos = async () => {
    const q = query(collection(db, "uploads"), where("type", "==", "video"));
    const querySnapshot = await getDocs(q);
    const videos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      contentType: doc.data().contentType || "video/mp4",
    }));
    setUploadedVideos(videos);
  };

  const deleteVideo = async (videoId) => {
    Alert.alert("Delete Video?", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "uploads", videoId));
          fetchUploadedVideos();
          if (uploadedVideos.find((vid) => vid.id === videoId)?.url === backgroundVideo?.url) {
            setBackgroundVideo(preloadedVideos[0] || null);
          }
          if (playingVideoId === videoId) setPlayingVideoId(null);
          if (fullscreenVideo?.id === videoId) setFullscreenVideo(null);
        },
      },
    ]);
  };

  const handleVideoPress = async (video, id) => {
    const videoId = id || `pre-${preloadedVideos.indexOf(video)}`;
    const ref = videoRefs.current[videoId];

    if (playingVideoId === videoId) {
      await ref.pauseAsync();
      setPlayingVideoId(null);
    } else {
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        await videoRefs.current[playingVideoId].pauseAsync();
      }
      await ref.playAsync();
      setPlayingVideoId(videoId);
    }

    setBackgroundVideo(video); // Optional: remove if not needed
  };

  const openFullscreen = (video) => {
    // Pause any playing inline video
    if (playingVideoId && videoRefs.current[playingVideoId]) {
      videoRefs.current[playingVideoId].pauseAsync();
      setPlayingVideoId(null);
    }
    setFullscreenVideo(video); // Open modal with video
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
  };

  return (
    <ImageBackground
      source={backgroundVideo ? (backgroundVideo.url ? { uri: backgroundVideo.url } : backgroundVideo) : { uri: "https://via.placeholder.com/150" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Videos</Text>

        <ScrollView contentContainerStyle={styles.videoGrid}>
          {/* Preloaded Videos */}
          {preloadedVideos.map((video, index) => {
            const videoId = `pre-${index}`;
            return (
              <View key={videoId} style={styles.videoContainer}>
                <TouchableOpacity onPress={() => handleVideoPress(video, videoId)}>
                  <Video
                    ref={(ref) => (videoRefs.current[videoId] = ref)}
                    source={video}
                    style={styles.video}
                    useNativeControls={false}
                    resizeMode="cover"
                    isLooping
                    shouldPlay={false}
                  />
                  <View style={styles.videoOverlay}>
                    {playingVideoId !== videoId && (
                      <Text style={styles.playIcon}>▶</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.fullscreenButton}
                  onPress={() => openFullscreen(video)}
                >
                  <Text style={styles.fullscreenText}>⤢</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Uploaded Videos */}
          {uploadedVideos.map((video) => (
            <View key={video.id} style={styles.videoContainer}>
              <TouchableOpacity onPress={() => handleVideoPress(video, video.id)}>
                <Video
                  ref={(ref) => (videoRefs.current[video.id] = ref)}
                  source={{ uri: video.url }}
                  style={styles.video}
                  useNativeControls={false}
                  resizeMode="cover"
                  isLooping
                  shouldPlay={false}
                />
                <View style={styles.videoOverlay}>
                  {playingVideoId !== video.id && (
                    <Text style={styles.playIcon}>▶</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fullscreenButton}
                onPress={() => openFullscreen(video)}
              >
                <Text style={styles.fullscreenText}>⤢</Text>
              </TouchableOpacity>
              {(auth.currentUser?.uid === video.userId || userRole === "admin") && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteVideo(video.id)}
                >
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate("UploadDesign", { type: "video", callback: fetchUploadedVideos })}
        >
          <Text style={styles.uploadText}>Upload New Video</Text>
        </TouchableOpacity>

        {/* Fullscreen Modal */}
        <Modal
          visible={!!fullscreenVideo}
          transparent={true}
          animationType="slide"
          onRequestClose={closeFullscreen}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.closeButton} onPress={closeFullscreen}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Video
              source={fullscreenVideo?.url ? { uri: fullscreenVideo.url } : fullscreenVideo}
              style={styles.fullscreenVideo}
              useNativeControls={true} // Enable native controls for full screen
              resizeMode="contain"
              isLooping
              shouldPlay={true} // Auto-play in full screen
            />
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 50,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: "#00b3ff",
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  videoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 20,
  },
  videoContainer: {
    position: "relative",
    margin: 5,
  },
  video: {
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 30,
    color: "#fff",
    opacity: 0.8,
  },
  fullscreenButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenText: {
    fontSize: 18,
    color: "#fff",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: "#00b3ff",
    padding: 15,
    borderRadius: 8,
  },
  uploadText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  fullscreenVideo: {
    width: "100%",
    height: "100%",
  },
});

export default VideosScreen;