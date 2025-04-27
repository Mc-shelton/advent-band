import { HomeFilled, HomeOutlined, ReadFilled, ReadOutlined } from "@ant-design/icons"
import CleanHands from "@mui/icons-material/CleanHands"
import CleanHandsOutlined from "@mui/icons-material/CleanHandsOutlined"
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import ChairIcon from '@mui/icons-material/Chair';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import Biotech from "@mui/icons-material/Biotech";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import Diversity1 from "@mui/icons-material/Diversity1";
import DiningIcon from '@mui/icons-material/Dining';
import AccountTree from "@mui/icons-material/AccountTree";
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import { AssuredWorkloadOutlined } from "@mui/icons-material";

const menuItems = [
    {
        title:'Home',
        path:'/',
        icon: <ChairIcon className="n_icon_ i_ac" />,
        icon_o: <ChairOutlinedIcon className="n_icon_" />
    },
    {
        title:'Bible',
        path:'/bible',
        icon_o: <CleanHandsOutlined className="n_icon_ " />,
        icon: <CleanHands className="n_icon_ i_ac" />
    },
    {
        title:'Hymns',
        path:'/hymns',
        icon_o: <Diversity1OutlinedIcon className="n_icon_" />,
        icon: <Diversity1 className="n_icon_ i_ac" />
    },
    {
        title:'Estate',
        path:'/estate',
        icon_o: <AssuredWorkloadOutlined className="n_icon_" />,
        icon: <AssuredWorkloadIcon className="n_icon_ i_ac" />
    },
    {
        title:'Discover',
        path:'/discover',
        icon_o: <BiotechOutlinedIcon className="n_icon_" />,
        icon: <Biotech className="n_icon_ i_ac" />
    },
    {
        title:'More',
        path:'/hymns',
        icon_o: <AccountTreeOutlinedIcon className="n_icon_" />,
        icon: <AccountTree className="n_icon_ i_ac" />
    }
]

export default menuItems