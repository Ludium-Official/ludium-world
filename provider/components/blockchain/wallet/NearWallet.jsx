"use client";

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NearWallet() {
  const router = useRouter();

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

  const signIn = async () => {
    const modal = setupModal(selector, {
      contranctId: process.env.NEXT_PUBLIC_NEAR_CONTRACT,
    });

    modal.show();
  };

  const signOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut();
    router.refresh();
  };

  return (
    <>
      {selector == null ? null : !selector.isSignedIn() ? (
        <button className="blockchain-wallet" onClick={signIn}>
          Near 지갑 연결하기
        </button>
      ) : (
        <div className="blockchain-wallet">
          <span>{accountId}</span> <button onClick={signOut}>연결해제</button>
        </div>
      )}
    </>
  );
}
