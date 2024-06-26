"use client";

import React, { useCallback, useState, useEffect } from "react";
import { v4 as uuid4 } from "uuid";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Actions, Tokens, TransactionType } from "@/types";
import Transaction from "@/components/Transaction";
import { strategy1 } from "@/constants/index";
import useWalletStore from "@/hooks";
// import { useAccount } from "wagmi";
// import { type WalletClient, getWalletClient } from '@wagmi/core'
// import { depositETH } from "../../api/depositETH";
// import { syncUsdcSwap, addliquidity } from "../../api/syncswap";
// import { muteUsdcSwap } from "../../api/mute";
// import { mavUsdcSwap } from "../../api/maverick";
// import { depositBorrow } from "../../api/reactorfusion";
// import {ethers} from "ethers";
// import * as zksync from "zksync-web3";

export default function Strategy1() {
  const [transactions, setTransactions] =
    useState<TransactionType[]>(strategy1);
  const [preTransactions, setPreTransactions] =
    useState<TransactionType[]>(transactions);
  const [editId, setEditId] = useState<string | null>(null);

  const reorder = (
    originalLists: TransactionType[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(originalLists);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // todo connect wallet
  const privateKey = "";

  const onTransactionDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reOrderedItems = reorder(
      transactions,
      result.source.index,
      result.destination.index
    );

    setPreTransactions(reOrderedItems);
    setTransactions(reOrderedItems);
  };

  const onStartTransaction = async () => {
    // if (!(window as any).ethereum) {
    //   alert("Please install wallet");
    // }
    // const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
    // // Prompt user for account connections
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // console.log("Account:", await signer.getAddress());

    // const transactionIDs: String[] = [];

    // transactions.forEach(element => {
    //   console.log(element);
    //   transactionIDs.push(element.id);
    // });

    // console.log("starting deposit to zksync");
    // const result0 = await depositETH(signer, transactions[0].amount);

    // console.log("syncswap start");
    // const result1 = await syncUsdcSwap(signer, transactions[1].amount);
    // console.log(result1);

    // console.log("mute swap start");
    // const result2 = await muteUsdcSwap(signer, transactions[2].amount);
    // console.log(result2, transactions[2].amount);

    // console.log("maverick swap start")
    // const result3 = await mavUsdcSwap(signer, transactions[3].amount);
    // console.log(result3, transactions[3].amount);

    // console.log("syncswap provide liquidity");
    // const result4 = await addliquidity(signer, transactions[4].amount, transactions[4].amount2);
    // console.log(result4, transactions[4].amount, transactions[4].amount2);

    // await depositBorrow(signer, transactions[5].amount, transactions[6].amount); 
  };

  const onNewTransactionClick = () => {
    const newId = uuid4();
    setPreTransactions([
      ...preTransactions,
      {
        id: newId,
        action: Actions.Buy,
        amount: 1,
        token: Tokens.USDC,
        platform: "",
        amount2: 1,
        token2: Tokens.USDC,
      },
    ]);

    setEditId(newId);
  };

  const onEditCancel = () => {
    setPreTransactions(transactions);
    setEditId(null);
  };

  const onSave = (_transaction: TransactionType) => {
    const _index = transactions.findIndex((t) => t.id == _transaction.id);
    const newTransactions =
      _index < 0
        ? [...transactions, _transaction]
        : [
          ...transactions.slice(0, _index),
          _transaction,
          ...transactions.slice(_index + 1),
        ];

    setTransactions(newTransactions);
    setPreTransactions(newTransactions);
    setEditId(null);
  };

  const onEdit = (_transaction: TransactionType) => {
    setEditId(_transaction.id);
  };

  const onDelete = (_transaction: TransactionType) => {
    ``;
    const _index = transactions.findIndex((t) => t.id == _transaction.id);
    const newTransactions = [
      ...transactions.slice(0, _index),
      ...transactions.slice(_index + 1),
    ];
    setTransactions(newTransactions);
    setPreTransactions(newTransactions);
  };

  const walletStore = useWalletStore();
  return (
    <div>
      <div className="overflow-x-auto max-w-[1366px] mx-auto m-5">
        {/* <div className="flex w-full justify-end">
          <button
            className="btn btn-outline btn-info"
            onClick={onNewTransactionClick}
            disabled={editId != null}
          >
            New Transaction
          </button>
        </div> */}
        <div className="mt-3">
          <DragDropContext onDragEnd={onTransactionDragEnd}>
            <Droppable droppableId="transactions-list">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {preTransactions.map((_transaction, index) => (
                    <Transaction
                      editId={editId}
                      transaction={_transaction}
                      index={index}
                      key={index}
                      onEditCancel={onEditCancel}
                      onSave={onSave}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {/* <button
          onClick={onStartTransaction}
          className="btn btn-success w-full my-6"
          disabled={walletStore.address == ""}
        >
          {walletStore.address == "" ? "Connect wallet to run." : "Run"}
        </button> */}
      </div>
    </div>
  );
}
