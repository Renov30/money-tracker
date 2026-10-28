'use client';

import React from 'react';
import GoalModal from './GoalModal';
import { Goal } from '@/types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (title: string, targetAmount: number) => void;
}

export default function AddGoalModal({
  isOpen,
  onClose,
  onAddGoal,
}: AddGoalModalProps) {
  const handleSave = (data: { title: string; targetAmount: number }) => {
    onAddGoal(data.title, data.targetAmount);
  };

  return (
    <GoalModal
      isOpen={isOpen}
      onClose={onClose}
      onSaveGoal={handleSave}
    />
  );
}
