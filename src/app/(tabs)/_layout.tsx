import { COLORS } from "@/src/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const TabLayout = () => {
  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.lightGray,
          tabBarActiveBackgroundColor: "orange",
          tabBarStyle: {
            position: "absolute",
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
        <Tabs.Screen
          name="user"
          options={{
            title: "User",
            tabBarIcon: ({ color }) => (
              <Feather name="heart" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
