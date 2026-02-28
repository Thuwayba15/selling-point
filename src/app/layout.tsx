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
import { PricingRequestsProvider } from "@/providers/pricing-requests";
import { ProposalsProvider } from "@/providers/proposals";
import { ContractsProvider } from "@/providers/contracts";
import { DashboardProvider } from "@/providers/dashboard";
import { ActivitiesProvider } from "@/providers/activities";
import { UsersProvider } from "@/providers/users";
import { NotesProvider } from "@/providers/notes";
import { DocumentsProvider } from "@/providers/documents";
import { antdTheme } from "@/theme/theme";
import { ReportsProvider } from "@/providers/reports";

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
          <UsersProvider>
            <ClientsProvider>
              <ContactsProvider>
                <OpportunitiesProvider>
                  <PricingRequestsProvider>
                    <ProposalsProvider>
                      <ContractsProvider>
                        <DashboardProvider>
                          <ActivitiesProvider>
                            <NotesProvider>
                              <DocumentsProvider>
                                <ReportsProvider>
                                  <AntdRegistry>
                                    <ConfigProvider theme={antdTheme}>
                                      <App>{children}</App>
                                    </ConfigProvider>
                                  </AntdRegistry>
                                </ReportsProvider>
                              </DocumentsProvider>
                            </NotesProvider>
                          </ActivitiesProvider>
                        </DashboardProvider>
                      </ContractsProvider>
                    </ProposalsProvider>
                  </PricingRequestsProvider>
                </OpportunitiesProvider>
              </ContactsProvider>
            </ClientsProvider>
          </UsersProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
