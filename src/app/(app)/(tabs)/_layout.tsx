import { COLORS } from "@/src/constants/Colors"
import { Feather } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { useEffect, useState } from "react"
import { Keyboard } from "react-native"

const TabLayout = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.lightGray,
        tabBarActiveBackgroundColor: "orange",
        tabBarStyle: {
          borderRadius: 30,
          marginBottom: keyboardVisible ? 0 : 10,
          marginHorizontal: 8,
          elevation: 0,
          height: 60,
        },
        tabBarItemStyle: {
          padding: 10,
          borderRadius: 30,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          unmountOnBlur: true,
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          headerShown: false,
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse/[...browse]"
        options={{
          unmountOnBlur: true,
          tabBarLabel: "Browse",
          tabBarIcon: ({ color }) => (
            <Feather name="folder-minus" size={24} color={color} />
          ),
        }}
        initialParams={{
          browse: ["Home"],
          currentFolderId: "home",
          previousFolderId: "home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarHideOnKeyboard: true,
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
          headerStyle: { backgroundColor: "orange" },
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "User",

          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
          headerStyle: { backgroundColor: "orange" },
          headerTitle: "Profile",
        }}
      />
    </Tabs>
  )
}

export default TabLayout
