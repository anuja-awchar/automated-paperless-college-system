import os
import django
from django.utils import timezone
import datetime
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aptcs_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from election.models import Election, Candidate, Vote

User = get_user_model()

def setup_data():
    print("Setting up test data...")

    # Create Test User
    user, created = User.objects.get_or_create(username='teststudent', email='test@example.com')
    if created:
        user.set_password('password123')
        user.save()
        print("Created user: teststudent / password123")
    else:
        print("User teststudent already exists")

    # Create dummy voters to make results interesting
    voters = []
    for i in range(1, 6):
        u, c = User.objects.get_or_create(username=f'voter{i}', email=f'voter{i}@example.com')
        if c:
            u.set_password('password123')
            u.save()
        voters.append(u)

    # 1. Closed Election with Results
    end_date = timezone.now() - datetime.timedelta(days=1)
    start_date = end_date - datetime.timedelta(days=5)
    
    closed_election, created = Election.objects.get_or_create(
        title="Student Council 2024",
        defaults={
            'description': "Election for last year's council.",
            'start_date': start_date,
            'end_date': end_date,
            'is_active': True
        }
    )
    
    if created:
        print(f"Created closed election: {closed_election.title}")
        c1 = Candidate.objects.create(election=closed_election, name="Alice Wonder", manifesto="More wonderland!")
        c2 = Candidate.objects.create(election=closed_election, name="Bob Builder", manifesto="Can we fix it?")
        c3 = Candidate.objects.create(election=closed_election, name="Charlie Chocolate", manifesto="Free candy!")
        
        # Cast votes
        # Alice gets 3, Bob gets 2, Charlie gets 0
        Vote.objects.create(election=closed_election, candidate=c1, voter=voters[0])
        Vote.objects.create(election=closed_election, candidate=c1, voter=voters[1])
        Vote.objects.create(election=closed_election, candidate=c1, voter=voters[2])
        Vote.objects.create(election=closed_election, candidate=c2, voter=voters[3])
        Vote.objects.create(election=closed_election, candidate=c2, voter=voters[4])
        print("Populated votes for closed election")
    else:
        print("Closed election already exists, skipping creation")

    # 2. Active Election
    start_date_active = timezone.now() - datetime.timedelta(days=1)
    end_date_active = timezone.now() + datetime.timedelta(days=2)

    active_election, created = Election.objects.get_or_create(
        title="Class Representative 2025",
        defaults={
            'description': "Vote for your class rep!",
            'start_date': start_date_active,
            'end_date': end_date_active,
            'is_active': True
        }
    )
    
    if created:
        print(f"Created active election: {active_election.title}")
        Candidate.objects.create(election=active_election, name="David Data", manifesto="I love graphs.")
        Candidate.objects.create(election=active_election, name="Eve Event", manifesto="Party every day.")
    else:
        print("Active election already exists")

if __name__ == '__main__':
    setup_data()
