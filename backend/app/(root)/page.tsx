import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSidebar";
import { email } from "zod";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import RecentTransactions from "@/components/RecentTransactions";
import { Pagination } from "@/components/Pagination";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts?.data || [];

  const appwriteItemId =
    (id as string) || accountsData[0]?.appwriteItemId || null;

  const account = await getAccount({ appwriteItemId });

  const rowsPerPage = 10;

  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <section className="home flex flex-row gap-4">
      {/* Main content */}
      <div className="home-content flex-1">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome "
            user={loggedIn?.firstName || "Guest"}
            subtext="This is your dashboard, where you can manage your account and settings."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      {/* Right sidebar */}
      <aside className="w-[280px]">
        <RightSideBar
          user={loggedIn}
          transactions={accounts?.transactions}
          banks={accountsData?.slice(0, 2)}
        />
      </aside>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination totalPages={totalPages} page={currentPage} />
        </div>
      )}
    </section>
  );
};

export default Home;
