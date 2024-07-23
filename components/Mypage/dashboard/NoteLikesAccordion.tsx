import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Like } from '../../../types/like';
import { Note } from '../../../types/note';
import { useTheme } from 'next-themes'; // useThemeフックをインポート

interface NoteLikesAccordionProps {
  noteLikes: Like[];
}

const isNote = (likeable: any): likeable is Note => likeable !== undefined && likeable.content !== undefined;

const NoteLikesAccordion: React.FC<NoteLikesAccordionProps> = ({ noteLikes }) => {
  const { theme } = useTheme(); // テーマフックを使用
  // 最初の6件のnoteLikesを取得
  const limitedNoteLikes = noteLikes.slice(0, 6);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
          最新「いいね」したメモ一覧
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {limitedNoteLikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {limitedNoteLikes.map((like) => {
              if (like.likeable && isNote(like.likeable)) {
                const note = like.likeable;
                const youtubeVideoTitle = note.youtube_video_title || 'タイトルを取得できませんでした';
                return (
                  <Card key={note.id} className="col-span-1 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 flex flex-col justify-between h-full">
                    <CardContent className="flex flex-col flex-grow overflow-hidden">
                      {note.user && (
                        <div className="flex items-center mb-2">
                          {note.user.avatar_url && (
                            <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
                          )}
                          <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
                        </div>
                      )}
                      <Typography variant="subtitle1" color="textPrimary" className="mb-1">
                        {youtubeVideoTitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="mb-2 flex-grow">
                        いいね数: {note.likes_count}
                      </Typography>
                    </CardContent>
                    {note.youtube_video_id && (
                      <Box textAlign="center" p={2}>
                        <Link href={`/youtube_videos/${note.youtube_video_id}`} passHref legacyBehavior>
                          <Button variant="contained" className="btn btn-outline btn-darkpink" size="small">
                            この動画を見る
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </Card>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
            いいねしたメモがありません。
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default NoteLikesAccordion;
