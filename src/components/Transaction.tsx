import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { Actions, Tokens, TransactionType } from '@/types';

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
    onSave({ ...(data as TransactionType), id: transaction.id });
  };

  const onActionSelected = (_selected: Actions) => {
    setActionType(_selected);
  };

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
            className={`p-3 border bg-white rounded-lg ${
              snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
            } transition-all ${
              isEditMode ? 'border-[2px] border-gray-400' : 'border'
            }`}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col lg:flex-row lg:justify-between items-center'
            >
              <div className='flex flex-grow items-start'>
                <div className='form-control w-full max-w-xs m-1'>
                  <label className='label'>
                    <span
                      className={`label-text ${
                        errors.platform && 'text-red-500'
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
                      target={'_blank'}
                      href={transaction.platform}
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
                  {isEditMode ? (
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
                  )}
                </div>

                <div className='m-1'>
                  <div className='flex w-full'>
                    <div className='form-control w-full max-w-[200px] mx-1'>
                      {actionType != Actions.Nft && (
                        <label className='label'>
                          <span className='label-text'>Token</span>
                        </label>
                      )}
                      {isEditMode ? (
                        <select
                          defaultValue={transaction.token}
                          {...register('token')}
                          className='select select-bordered w-full max-w-[200px]'
                          disabled={actionType == Actions.Nft}
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
                        actionType != Actions.Nft && (
                          <span className='flex px-1 h-full items-center'>
                            {transaction.token}
                          </span>
                        )
                      )}
                    </div>

                    <div className='form-control w-full max-w-[200px] mx-1'>
                      {actionType != Actions.Nft && (
                        <label className='label'>
                          <span
                            className={`label-text ${
                              errors.amount && 'text-red-500'
                            }`}
                          >
                            Amount
                          </span>
                        </label>
                      )}
                      {isEditMode ? (
                        <input
                          defaultValue={transaction.amount}
                          {...register('amount', {
                            min: 1.0,
                            valueAsNumber: true,
                          })}
                          type='number'
                          step={0.01}
                          className='input input-bordered w-full'
                          disabled={actionType == Actions.Nft}
                        />
                      ) : (
                        actionType != Actions.Nft && (
                          <span className='flex px-1 h-full items-center '>
                            {transaction.amount}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className='flex w-full mt-3'>
                    <div className='form-control w-full max-w-[200px] mx-1'>
                      {actionType == Actions.Liquidity && (
                        <label className='label'>
                          <span className='label-text'>Token</span>
                        </label>
                      )}
                      {isEditMode ? (
                        <select
                          defaultValue={transaction.token2}
                          {...register('token2')}
                          className='select select-bordered w-full max-w-[200px]'
                          disabled={actionType != Actions.Liquidity}
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
                        actionType == Actions.Liquidity && (
                          <span className='flex px-1 h-full items-center'>
                            {transaction.token2}
                          </span>
                        )
                      )}
                    </div>

                    <div className='form-control w-full max-w-[200px] mx-1'>
                      {actionType == Actions.Liquidity && (
                        <label className='label'>
                          <span
                            className={`label-text ${
                              errors.amount2 && 'text-red-500'
                            }`}
                          >
                            Amount
                          </span>
                        </label>
                      )}
                      {isEditMode ? (
                        <input
                          defaultValue={transaction.amount2}
                          {...register('amount2', {
                            min: 1.0,
                            valueAsNumber: true,
                          })}
                          type='number'
                          step={0.01}
                          className='input input-bordered w-full'
                          disabled={actionType != Actions.Liquidity}
                        />
                      ) : (
                        actionType == Actions.Liquidity && (
                          <span className='flex px-1 h-full items-center '>
                            {transaction.amount2}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isHover && !isEditMode && (
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
                    onClick={() => onDelete(transaction)}
                    className='btn btn-outline btn-error'
                  >
                    Delete
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
