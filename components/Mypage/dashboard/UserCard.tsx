import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { CustomUser } from '../../../types/user';

interface UserCardProps {
  currentUser: CustomUser;
  isAdmin: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ currentUser, isAdmin }) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center mb-4">
          {currentUser.avatar_url && (
            <Avatar src={currentUser.avatar_url} alt="Avatar" sx={{ width: 64, height: 64, mr: 2 }} />
          )}
          <div className="text-container">
            <Typography variant="h6" className="text-wrap">{currentUser.name}</Typography>
            <Typography variant="body2" color="textSecondary" className="text-wrap">{currentUser.email}</Typography>
          </div>
        </div>
        <Link href="/mypage/edit" legacyBehavior>
          <Button variant="contained" className="btn btn-outline btn-skyblue" fullWidth>ユーザー編集</Button>
        </Link>
        {isAdmin && (
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/admin/users`} legacyBehavior>
            <Button variant="contained" color="secondary" fullWidth className="mt-4">会員一覧</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
