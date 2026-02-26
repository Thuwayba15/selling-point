
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ConfigProvider, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";
import "./globals.css";

import { AuthProvider } from "@/providers/auth";
import { ClientsProvider } from "@/providers/clients";
import { ContactsProvider } from "@/providers/contacts";
import { OpportunitiesProvider } from "@/providers/opportunities";
import { antdTheme } from "@/theme/theme";
// import { ProposalsProvider } from "@/providers/proposals";
// import { ContractsProvider } from "@/providers/contracts";
// import { ActivitiesProvider } from "@/providers/activities";
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
          <ClientsProvider>
            <ContactsProvider>
              <OpportunitiesProvider>
                <AntdRegistry>
                  <ConfigProvider theme={antdTheme}>
                    <App>{children}</App>
                  </ConfigProvider>
                </AntdRegistry>
              </OpportunitiesProvider>
            </ContactsProvider>
          </ClientsProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
