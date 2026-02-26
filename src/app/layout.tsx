
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";
import "./globals.css";

import { AuthProvider } from "@/providers/auth";
import { antdTheme } from "@/theme/theme";
// import { OpportunitiesProvider } from "@/providers/opportunities";
// import { ProposalsProvider } from "@/providers/proposals";
// import { ContractsProvider } from "@/providers/contracts";
// import { ActivitiesProvider } from "@/providers/activities";
// import { ClientsProvider } from "@/providers/clients";
// import { ReportsProvider } from "@/providers/reports";
// import { UsersProvider } from "@/providers/users";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700"],
  display: "swap",
});

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <OpportunitiesProvider>
            <ProposalsProvider>
              <ContractsProvider>
                <ActivitiesProvider>
                  <ClientsProvider>
                    <ReportsProvider>
                      <UsersProvider> */}
          <AntdRegistry>
            <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
          </AntdRegistry>
          {/* </UsersProvider>
                    </ReportsProvider>
                  </ClientsProvider>
                </ActivitiesProvider>
              </ContractsProvider>
            </ProposalsProvider>
          </OpportunitiesProvider>*/}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
