import { Flex, Spinner } from "@chakra-ui/react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import Sidebar from "../components/Common/Sidebar";
import UserMenu from "../components/Common/UserMenu";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import Navbar from "../components/Common/Navbar";
import SidebarItems from "../components/Common/SidebarItems";

export const Route = createFileRoute("/_layout")({
  component: Layout,
  // beforeLoad: async () => {
  //   if (!isLoggedIn()) {
  //     throw redirect({
  //       to: "/login",
  //     })
  //   }
  // },
});

function Layout() {
  const { isLoading } = useAuth();

  return (
    <div className="w-full min-h-screen">
      <Navbar />

      <div className="flex">
        {/* <Sidebar /> */}
        {/* {isLoading ? (
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : ()} */}
        <Outlet />

        {/* <UserMenu /> */}
      </div>
    </div>
  );
}
