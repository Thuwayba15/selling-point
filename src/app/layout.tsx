import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { AuthProvider } from "@/providers/auth";
import { OpportunitiesProvider } from "@/providers/opportunities";
// import { ProposalsProvider } from "@/providers/proposals";
// import { ContractsProvider } from "@/providers/contracts";
// import { ActivitiesProvider } from "@/providers/activities";
// import { ClientsProvider } from "@/providers/clients";
// import { ReportsProvider } from "@/providers/reports";
// import { UsersProvider } from "@/providers/users";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AuthProvider>
             <OpportunitiesProvider>
             {/* <ProposalsProvider>
                <ContractsProvider>
                    <ActivitiesProvider>
                      <ClientsProvider>
                        <ReportsProvider>
                          <UsersProvider> */}
                            {children}
                            {/* </UsersProvider>
                        </ReportsProvider>
                      </ClientsProvider>
                    </ActivitiesProvider>
                </ContractsProvider>
              </ProposalsProvider>*/}
            </OpportunitiesProvider>
          </AuthProvider>
        </AntdRegistry> 
      </body>
    </html>
  );
};

export default RootLayout;
