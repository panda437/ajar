import { render, screen, fireEvent } from '@testing-library/react';
import RewardMemberModal from '../components/RewardMemberModal';

describe('RewardMemberModal', () => {
  it('renders modal with form fields', () => {
    const refreshMembers = jest.fn();
    const onClose = jest.fn();

    render(
      <RewardMemberModal
        isOpen={true}
        onClose={onClose}
        recipientId="123"
        memberName="John Doe"
        refreshMembers={refreshMembers}
      />
    );

    expect(screen.getByText(/Reward John Doe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('calls API and refreshes members on submit', async () => {
    const refreshMembers = jest.fn();
    const onClose = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      })
    );

    render(
      <RewardMemberModal
        isOpen={true}
        onClose={onClose}
        recipientId="123"
        memberName="John Doe"
        refreshMembers={refreshMembers}
      />
    );

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    fireEvent.submit(screen.getByRole('button', { name: /Reward/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/transactions',
      expect.objectContaining({ method: 'POST' })
    );

    expect(refreshMembers).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});