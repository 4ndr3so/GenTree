import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './ui/button';

interface NewPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (person: { firstName: string; lastName: string; birthDate: string }) => void;
}

export default function NewPersonModal({ isOpen, onClose, onSubmit }: NewPersonModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = () => {
    if (firstName && lastName && birthDate) {
      onSubmit({ firstName, lastName, birthDate });
      setFirstName('');
      setLastName('');
      setBirthDate('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

      <div className="relative z-50 bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-semibold mb-4">Add New Person</Dialog.Title>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
