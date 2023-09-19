import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { Actions, Tokens, TransactionType } from '@/types';

import { depositETH } from "../api/depositETH";
import { syncUsdcSwap, addliquidity } from "../api/syncswap";
import { muteUsdcSwap } from "../api/mute";
import { mavUsdcSwap } from "../api/maverick";
import { depositBorrow } from "../api/reactorfusion";
import { ethers } from "ethers";
import { Web3Provider } from "zksync-web3";

interface ITransaction {
  transaction: TransactionType;
  editId: string | null;
  index: number;
  onEditCancel(): void;
  onSave(_transaction: TransactionType): void;
  onEdit(_transaction: TransactionType): void;
  onDelete(_transaction: TransactionType): void;
}

type Inputs = {
  platform: string;
  action: Actions;
  token: Tokens;
  amount: number;
  token2: Tokens;
  amount2: number;
};

const Transaction: React.FC<ITransaction> = ({
  transaction,
  index,
  editId,
  onEditCancel,
  onSave,
  onEdit,
  onDelete,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [actionType, setActionType] = useState<Actions>(transaction.action);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let retdata = { ...transaction, ...data };
    onSave({ ...(retdata as TransactionType), id: transaction.id });
  };

  const onActionSelected = (_selected: Actions) => {
    setActionType(_selected);
  };

  const onRun = async () => {
    if (!(window as any).ethereum) {
      alert("Please install wallet");
    }
    const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    if (transaction.id === "1") {
      console.log("starting deposit to zksync");
      const result0 = await depositETH(signer, transaction.amount);
      console.log(result0);
      if (!result0) {
        alert("transaction failed");
      }
      else {
        alert(`Successful! view on explorer: https://explorer.zksync.io/tx/${result0}`);
      }
    }

    if (transaction.id === "2") {
      console.log("syncswap start");
      const result1 = await syncUsdcSwap(signer, transaction.amount);
      console.log(result1);
      if (!result1) {
        alert("transaction failed");
      }
      else {
        alert(`Successful! view on explorer: https://explorer.zksync.io/tx/${result1}`);
      }
    }

    if (transaction.id === "3") {
      console.log("mute swap start");
      const result2 = await muteUsdcSwap(signer, transaction.amount);
      console.log(result2);
      if (!result2) {
        alert("transaction failed");
      }
      else {
        alert(`Successful! view on explorer: https://explorer.zksync.io/tx/${result2}`);
      }
    }

    if (transaction.id === "4") {
      console.log("maverick swap start")
      const result3 = await mavUsdcSwap(signer, transaction.amount);
      console.log(result3);
      if (!result3) {
        alert("transaction failed");
      }
      else {
        alert(`Successful! view on explorer: https://explorer.zksync.io/tx/${result3}`);
      }
    }

    if (transaction.id === "5") {
      console.log("syncswap provide liquidity");
      const result4 = await addliquidity(signer, transaction.amount, transaction.amount2);
      console.log(result4);
      if (!result4) {
        alert("transaction failed");
      }
      else {
        alert(`Successful! view on explorer: https://explorer.zksync.io/tx/${result4}`);
      }
    }

    if (transaction.id === "6") {
      console.log("reactorfusion lend and borrow");
      await depositBorrow(signer, transaction.amount, transaction.amount2);
    }
  }

  const isEditMode = editId != null && editId == transaction.id;

  return (
    <Draggable
      draggableId={transaction.id}
      index={index}
      key={transaction.id}
      isDragDisabled={editId != null}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className='m-1'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            className={`p-3 border bg-white rounded-lg ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
              } transition-all ${isEditMode ? 'border-[2px] border-gray-600' : 'border'
              }`}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col lg:flex-row lg:justify-between items-center'
            >
              <div className='flex flex-grow'>
                <div className='form-control w-full max-w-xs m-1'>
                  <label className='label'>
                    <span
                      className={`label-text ${errors.platform && 'text-red-500'
                        }`}
                    >
                      Platform
                    </span>
                  </label>
                  {isEditMode ? (
                    <input
                      defaultValue={transaction.platform}
                      {...register('platform', { required: true })}
                      type='text'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-xs'
                    />
                  ) : (
                    <a
                      href={transaction.platform}
                      target='_blank'
                      className='flex px-1 h-full items-center hover:text-blue-500'
                    >
                      {transaction.platform}
                    </a>
                  )}
                </div>

                <div className='form-control w-full max-w-[200px] m-1'>
                  <label className='label'>
                    <span className='label-text'>Transaction Type</span>
                  </label>
                  {/* {isEditMode ? (
                    <select
                      defaultValue={actionType}
                      {...register('action')}
                      className='select select-bordered w-full max-w-[200px]'
                      onChange={(e) =>
                        onActionSelected(e.currentTarget.value as Actions)
                      }
                    >
                      {Object.keys(Actions).map((_key) => (
                        <option
                          key={_key}
                          value={_key}
                          selected={transaction.action == (_key as Actions)}
                        >
                          {_key}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className='flex px-1 h-full items-center'>
                      {transaction.action}
                    </span>
                  )} */}
                  <span className='flex px-1 h-full items-center'>
                    {transaction.action}
                  </span>
                </div>

                <div className='m-1'>
                  <div className='flex w-full'>
                    <div className='form-control w-full max-w-[200px] mx-1'>
                      <label className='label'>
                        <span className='label-text'>Token</span>
                      </label>
                      <span className='flex px-1 h-full items-center'>
                        {transaction.token}
                      </span>
                      {/* {isEditMode ? (
                        <select
                          defaultValue={transaction.token}
                          {...register('token')}
                          className='select select-bordered w-full max-w-[200px]'
                        >
                          {Object.keys(Tokens).map((_key) => (
                            <option
                              key={_key}
                              value={_key}
                              selected={transaction.token == (_key as Tokens)}
                            >
                              {_key}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className='flex px-1 h-full items-center'>
                          {transaction.token}
                        </span>
                      )} */}
                    </div>

                    <div className='form-control w-full max-w-[200px] mx-1'>
                      <label className='label'>
                        <span
                          className={`label-text ${errors.amount && 'text-red-500'
                            }`}
                        >
                          Amount
                        </span>
                      </label>
                      {isEditMode ? (
                        <input
                          defaultValue={transaction.amount}
                          {...register('amount', {
                            // min: 1.0,
                            valueAsNumber: true,
                          })}
                          type='number'
                          step={0.0001}
                          className='input input-bordered w-full'
                        />
                      ) : (
                        <span className='flex px-1 h-full items-center '>
                          {transaction.amount}
                        </span>
                      )}
                    </div>
                  </div>
                  {
                    transaction.token2 && (
                      <div className='flex w-full mt-3'>
                        <div className='form-control w-full max-w-[200px] mx-1'>
                          <label className='label'>
                            <span className='label-text'>Token</span>
                          </label>
                          <span className='flex px-1 h-full items-center'>
                            {transaction.token2}
                          </span>
                          {/* {isEditMode ? (
                          <select
                            defaultValue={transaction.token2}
                            {...register('token2')}
                            className='select select-bordered w-full max-w-[200px]'
                          >
                            {Object.keys(Tokens).map((_key) => (
                              <option
                                key={_key}
                                value={_key}
                                selected={transaction.token == (_key as Tokens)}
                              >
                                {_key}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className='flex px-1 h-full items-center'>
                            {transaction.token2}
                          </span>
                        )} */}
                        </div>

                        <div className='form-control w-full max-w-[200px] mx-1'>
                          <label className='label'>
                            <span
                              className={`label-text ${errors.amount2 && 'text-red-500'
                                }`}
                            >
                              Amount
                            </span>
                          </label>
                          {isEditMode ? (
                            <input
                              defaultValue={transaction.amount2}
                              {...register('amount2', {
                                // min: 1.0,
                                valueAsNumber: true,
                              })}
                              type='number'
                              step={0.0001}
                              className='input input-bordered w-full'
                            />
                          ) : (
                            <span className='flex px-1 h-full items-center '>
                              {transaction.amount2}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>

              {isHover && editId == null && (
                <div className='flex mt-3 lg:mt-0'>
                  <button
                    onClick={() => {
                      reset();
                      onEdit(transaction);
                    }}
                    className='btn btn-outline btn-warning mr-2'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onRun();
                    }}
                    className='btn btn-outline btn-error'
                  >
                    Run
                  </button>
                </div>
              )}
              {isEditMode && (
                <div className='flex mt-3 lg:mt-0'>
                  <button
                    className='btn btn-outline btn-success mr-2'
                    type='submit'
                  >
                    Save
                  </button>
                  <button className='btn btn-outline' onClick={onEditCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Transaction;
