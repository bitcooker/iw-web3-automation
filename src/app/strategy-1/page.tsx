'use client';
import React, { useCallback, useState, useEffect } from 'react';
import { v4 as uuid4 } from 'uuid';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { Actions, Tokens, TransactionType } from '@/types';
import Transaction from '@/components/Transaction';
import { strategy1 } from '@/constants/index';

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

  const onTransactionDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reOrderedItems = reorder(
      preTransactions,
      result.source.index,
      result.destination.index
    );

    setPreTransactions(reOrderedItems);
    setTransactions(reOrderedItems);
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
        platform: '',
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
    const _index = transactions.findIndex((t) => t.id == _transaction.id);
    const newTransactions = [
      ...transactions.slice(0, _index),
      ...transactions.slice(_index + 1),
    ];
    setTransactions(newTransactions);
    setPreTransactions(newTransactions);
  };

  return (
    <div>
      <div className='overflow-x-auto max-w-[1366px] mx-auto m-5'>
        <div className='flex w-full justify-end'>
          <button
            className='btn btn-outline btn-info'
            onClick={onNewTransactionClick}
            disabled={editId != null}
          >
            New Transaction
          </button>
        </div>
        <div className='mt-3'>
          <DragDropContext onDragEnd={onTransactionDragEnd}>
            <Droppable droppableId='transactions-list'>
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
      </div>
    </div>
  );
}
