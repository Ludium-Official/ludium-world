import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { useEffect, useState } from "react";

export const useNearWallet = () => {
  const [selector, setSelector] = useState(null);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    setupWalletSelector({
      network: process.env.NEXT_PUBLIC_NEAR_NETWORK,
      modules: [setupMyNearWallet()],
    }).then((res) => {
      setSelector(res);
    });
  }, []);

  useEffect(() => {
    if (selector && selector.isSignedIn()) {
      selector.wallet().then((wallet) => {
        wallet.getAccounts().then((accounts) => {
          setAccountId(accounts[0].accountId);
        });
      });
    }
  }, [selector]);

  return {
    selector,
    accountId,
  };
};
