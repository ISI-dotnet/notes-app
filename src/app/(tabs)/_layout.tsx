import { Feather } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { Colors } from "react-native-ui-lib"
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.lightGray,
        tabBarActiveBackgroundColor: "orange",
        tabBarStyle: {
          borderRadius: 30,
          marginBottom: 10,
          marginHorizontal: 5,
          elevation: 0,
          height: 60,
        },
        tabBarItemStyle: {
          padding: 10,
          borderRadius: 100,
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
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => (
            <Feather name="folder-minus" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout
