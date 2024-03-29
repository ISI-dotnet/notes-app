import { COLORS } from "@/src/constants/Colors"
import { Feather } from "@expo/vector-icons"
import { Tabs } from "expo-router"

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.lightGray,
        tabBarActiveBackgroundColor: "orange",
        tabBarStyle: {
          borderRadius: 30,
          marginBottom: 10,
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
          tabBarLabel: "Browse",
          tabBarIcon: ({ color }) => (
            <Feather name="folder-minus" size={24} color={color} />
          ),
        }}
        initialParams={{
          browse: ["Home"],
          currentFolderId: "home",
          previousFolderId: "",
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          headerShown: false,
          title: "User",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout
