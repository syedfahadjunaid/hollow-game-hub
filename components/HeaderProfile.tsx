import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/8bit/avatar";

export default function HeaderProfile() {
  return (
    <Avatar className="size-15">
      <AvatarImage
        src="https://8bitcn.com/images/pixelized-8bitcnorc.jpg"
        alt="@8bitcn"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
