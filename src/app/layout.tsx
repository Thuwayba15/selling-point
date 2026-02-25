
import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";
import './globals.css';
import { Inter } from "next/font/google";
import { ConfigProvider } from 'antd';

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700"],
  display: "swap",
});

import { AuthProvider } from "@/providers/auth";
// import { OpportunitiesProvider } from "@/providers/opportunities";
// import { ProposalsProvider } from "@/providers/proposals";
// import { ContractsProvider } from "@/providers/contracts";
// import { ActivitiesProvider } from "@/providers/activities";
// import { ClientsProvider } from "@/providers/clients";
// import { ReportsProvider } from "@/providers/reports";
// import { UsersProvider } from "@/providers/users";

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
                            <ConfigProvider>
                            {children}
                            </ConfigProvider>
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
