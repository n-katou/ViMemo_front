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
import { Like } from '../../types/like';
import { Note } from '../../types/note';
import { CustomUser } from '../../types/user';

interface NoteLikesAccordionProps {
  noteLikes: Like[];
}

const isNote = (likeable: any): likeable is Note => likeable !== undefined && likeable.content !== undefined;

const NoteLikesAccordion: React.FC<NoteLikesAccordionProps> = ({ noteLikes }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">最新「いいね」したメモ一覧</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {noteLikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {noteLikes.map((like, index) => {
              if (like.likeable && isNote(like.likeable)) {
                const note = like.likeable;
                return (
                  <Card key={note.id} className="col-span-1 custom-card-size">
                    <CardContent className="custom-card-content">
                      {note.user && (
                        <div className="flex items-center mb-4">
                          {note.user.avatar_url && (
                            <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
                          )}
                          <div>
                            <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
                          </div>
                        </div>
                      )}
                      <Typography variant="body2" color="textPrimary" className="mb-2 note-content">メモ内容：{note.content}</Typography>
                      <Typography variant="body2" color="textSecondary">いいね数：{note.likes_count}</Typography>
                      {note.youtube_video_id && (
                        <Box mt={2}>
                          <Link href={`/youtube_videos/${note.youtube_video_id}`} legacyBehavior>
                            <Button variant="contained" className="btn btn-outline btn-darkpink" size="small">この動画を見る</Button>
                          </Link>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">いいねしたメモがありません。</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default NoteLikesAccordion;
